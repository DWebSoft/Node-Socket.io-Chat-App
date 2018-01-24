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

    //Welcome User
    socket.emit('newMessage',{
        from: 'Admin',
        text: "Welcome to the chat app!",
        createdAt: new Date().getTime()
    });

    //Notify Everyone
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: "New user connected!",
        createdAt: new Date().getTime()
    });

    //Listen for createMessage
    socket.on('createMessage', (message) => {
        console.log(message);

        //Emit newMessage to all connected clients
        message.createdAt = new Date().toString();
        io.emit('newMessage', {
            from: message.from,
            text: message.from,
            createdAt: new Date().getTime() 
        });
    })

    socket.on('disconnect', () => {
        console.log('User was disconnected');
    });
}) 


//listen for request
server.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})