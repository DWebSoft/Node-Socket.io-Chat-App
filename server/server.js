const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

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

    //Listen for createMessage
    socket.on('createMessage', (message) => {
        console.log(message);

        //Emit newMessage
        message.createdAt = new Date();
        socket.emit('newMessage', message);
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
}) 


//listen for request
server.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})