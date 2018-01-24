//Initialize socket
var socket = io();

//fire event on connection
socket.on('connect', function(){
    console.log('Connected to server');
});

//Listen to newMessage
socket.on('newMessage', function(message){
    console.log('new message', message);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});