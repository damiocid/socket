const express = require('express');

const app  = express(),
      http = require('http').Server(app),
      io   = require('socket.io')(http),
      port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

io.on('connection', () => {
  console.log('User connected via socket.io');
});

http.listen(port, () => {
  console.log('SERVERRRRRR IS LIVEEEEEE!!!!!!!!!!');
});
