var socket = io();

socket.on('connect', function() {
  console.log('connected to socket.io server');
});
// 
// var h1 = document.createElement(h1);
// var node = document.createTextNode('HELLO');
// var caca = h1.appendChild(node);
// document.getElementByTagName('body').appendChild(caca);
