const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const port = process.env.PORT || 3000;

const {generateMessage, generateLocationMessage}  = require('./utils/message');
const { isRealString } = require('./utils/validation');
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');

//Create a global users object
var users = new Users();

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

    //Listen for join
    socket.on('join', (params,callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and Room name are required');
        }

        //Join the room
        socket.join(params.room);
        //socket.leave(params.room)

        //First remove the user from any other chatroom
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        // io.emit => io.to('room name').emit
        // socket.broadcast.emit => socket.broadcast.to('room name').emit
        // socket.emit

        // Welcome User
        socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app!"));

        // Notify Everyone(except user itself) in the room
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} connected!`));

        callback();
    })

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
        var user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    });
}) 


//listen for request
server.listen(port, () => {
    console.log(`Server is up at port ${port}`);
})