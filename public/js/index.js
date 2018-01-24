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

//Listen to newLocationMessage
socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});

var messageTextBox = jQuery('[name=message]');
jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    //Emit Message
    socket.emit('createMessage',{
        from: 'User',
        text: messageTextBox.val()
    },function(){
        //Acknowledge
        messageTextBox.val('');
    });
});

var locationBtn = jQuery('#send-location');
locationBtn.on('click', function(e){
    if(!navigator.geolocation){
        return alert('Your browser does not support geolocation');
    }

    locationBtn.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationBtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationBtn.removeAttr('disabled').text('Send location');
        return alert('Unable to get location');
    });
});