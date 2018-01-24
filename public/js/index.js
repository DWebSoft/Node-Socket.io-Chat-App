//Initialize socket
var socket = io();

//fire event on connection
socket.on('connect', function(){
    console.log('Connected to server');

    //emit createMessage
    socket.emit('createMessage', {
        from : 'Durgesh',
        text : 'Hi'
    })
});

//Listen to newMessage
socket.on('newMessage', function(message){
    console.log(message);
});

socket.on('disconnect', function(){
    console.log('Disconnected from server');
});