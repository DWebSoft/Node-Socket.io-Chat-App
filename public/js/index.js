//Initialize socket
var socket = io();

//fire event on connection
socket.on('connect', function(){
    console.log('Connected to server');
});

//Listen to newMessage
socket.on('newMessage', function(message){
    console.log('new message', message);

    //Add message on screen
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    //Emit Message
    socket.emit('createMessage',{
        from: 'User',
        text: jQuery('[name=message]').val()
    },function(){
        //Acknowledge
    });
});