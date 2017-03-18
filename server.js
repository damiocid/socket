var port    = process.env.PORT || 3000,
    express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    now     = require('moment')();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

io.on('connection', function(socket) {
  console.log('User connected via socket.io!');

  socket.on('joinRoom', function(req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: now.valueOf()
    });

  });

  socket.on('message', function(message) {
    var time = now.utc(message.timestamp).local().format('h:mm a');
    console.log('Message received: ' + message.text + ' at ' + time);

    io.to(clientInfo[socket.id].room).emit('message', message);
  });

  socket.emit('message', {
    name: 'System',
    text: "Welcome to the chat app!",
    timestamp: now.valueOf()
  });
});

http.listen(port, function() {
  console.log('Server started!');
});
