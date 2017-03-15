const express = require('express');


const app  = express(),
      http = require('http').Server(app),
      port = process.env.PORT || 4545;


app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
  console.log('SERVERRRRRR IS LIVEEEEEE');
})
