$(function() {
  var socket = io(),
      name = getQueryVariable('name') || 'Anonymous', 
      room = getQueryVariable('room');

  $('body').prepend('<p>' + '<strong>' + name + '</strong> joined room <strong>'+ room + '</strong></p>');

  socket.on('connect', function() {
    console.log('Connected to socket.io server!');
  });

  socket.on('message', function(message) {
    console.log('New message: ');
    console.log(message.text);
    var $message = $('.messages');
    var time = moment.utc(message.timestamp).local().format('h:mm a');

    $message.append('<p><strong>' + message.name + ' ' + time + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
  });

  //Handles submitting of new message
  var $form = $('#message-form');

  $form.on('submit', function(e) {
    e.preventDefault();

    var $message = $form.find('input[name=message]');

    socket.emit('message', {
      name: name,
      text: $message.val()
    });

    $message.val('');
  });

});
