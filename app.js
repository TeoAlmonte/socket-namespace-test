const express = require('express')
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 4000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});

app.get('/p', (req, res) => {
  res.sendFile(__dirname + '/public/private.html')
});

const namespace = io.of('/ns')
const priv = io.of('/pr')

namespace.on('connection', (socket) => {
  console.log('user connected');

  socket.on('join', (data) => {
    socket.join(data.room)
    namespace.in(data.room).emit('message', `new user joined ${data.room} !!`)
  })

  socket.on('message', (data) => {
    console.log(`message: ${data.msg}`);
    namespace.in(data.room).emit('message', data.msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    namespace.emit('message', 'user disconnected');
  })

})
