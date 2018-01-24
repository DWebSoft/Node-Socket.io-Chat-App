const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage}  = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

//create app
var app = express();

//setup static midddleware
app.use(express.static(publicPath));

//create http server
var server = http.createServer(app);

//Setup socket io . Bind socketio to a http server
var io = socketIO(server);

//Check connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //Welcome User
    socket.emit('newMessage', generateMessage("Admin","Welcome to the chat app!"));

    //Notify Everyone
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user connected!'));

    //Listen for createMessage
    socket.on('createMessage', (message, callback) => {
        console.log(message);

        //Emit newMessage to all connected clients
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    })

    //Listen createLocationMessage
    socket.on('createLocationMessage',(cords) => {
        console.log(cords);
        io.emit('newLocationMessage', generateLocationMessage('Admin', cords.latitude, cords.longitude));
    });
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
}) 


//listen for request
server.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})