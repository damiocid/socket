$(function() {
  var socket = io(),
      name = getQueryVariable('name') || 'Anonymous',
      room = getQueryVariable('room');

$('.room-title').text(room);

  socket.on('connect', function() {
    console.log('Connected to socket.io server!');
    //client event to sever
    socket.emit('joinRoom', {
      name: name,
      room: room
    });
  });

  socket.on('message', function(message) {
    console.log('New message: ');

    console.log(message.text);
    var $messages = $('.messages');
    var $message = $('<li class="list-group-item"></li>');
    var time = moment.utc(message.timestamp).local().format('h:mm a');

    $message.append('<p><strong>' + message.name + ' ' + time + '</strong></p>');
    $message.append('<p>' + message.text + '</p>');
    $messages.append($message);
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
