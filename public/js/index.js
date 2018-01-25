//Initialize socket
var socket = io();

//fire event on connection
socket.on('connect', function(){
    console.log('Connected to server');
});

var messageContainer = jQuery('#messages');
//Listen to newMessage
socket.on('newMessage', function(message){
    console.log('new message', message);
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template,{
        from: message.from,
        text: message.text,
        createdAt: formattedTime
    });
    messageContainer.append(html);
});

//Listen to newLocationMessage
socket.on('newLocationMessage', function(message){
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });
    messageContainer.append(html);
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