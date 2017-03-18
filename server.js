var port    = process.env.PORT || 3000,
    express = require('express'),
    app     = express(),
    http    = require('http').Server(app),
    io      = require('socket.io')(http),
    now     = require('moment')();

app.use(express.static(__dirname + '/public'));

var clientInfo = {};

//sends current users to provided socket
function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];

  if(typeof info === 'undefined'){
    return;
  }
  Object.keys(clientInfo).forEach(function(socketId) {
    var userInfo = clientInfo[socketId];

    if(info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: 'Current users: ' + users.join(', '),
    timestamp: now.valueOf()
  });
}

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

    if (message.text === '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      io.to(clientInfo[socket.id].room).emit('message', message);
      console.log('Message received: ' + message.text + ' at ' + time);
    }
  });

  socket.emit('message', {
    name: 'System',
    text: "Welcome to the chat app!",
    timestamp: now.valueOf()
  });

  socket.on('disconnect', function() {
    var userData = clientInfo[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(userData.room);
      socket.broadcast.to(userData.room).emit('message', {
        name: 'System',
        text: userData.name + ' has left the room!',
        timestamp: now.valueOf()
      });
      delete clientInfo[socket.id];
    }
  });
});

http.listen(port, function() {
  console.log('Server started!');
});
