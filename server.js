var express = require('express');

var app  = express(),
      port = process.env.PORT || 4000,
      http = require('http').Server(app),
      io   = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
  console.log('User connected via socket.io');

  socket.on('message', function(message) {
    console.log('Message recieved: ' + message.text);

    socket.broadcast.emit('messsage', message);
  });

  socket.emit('message', {
    text: 'Welcome to the chat app!'
  });
});

http.listen(port, function() {
  console.log('SERVERRRRRR IS LIVEEEEEE!!!!!!!!!!');
});
