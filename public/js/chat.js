//Initialize socket
var socket = io();

//fire event on connection
socket.on('connect', function(){
    console.log('Connected to server');
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log('Joined Successfully! No errors.')
        }
    });
});

var messageContainer = jQuery('#messages');
var unreadMessages = 0;
var unreadMessagesContainer = jQuery('.unread-messages');

//Check when user scrolled to bottom
jQuery(messageContainer).on('scroll', function(){
    if (messageContainer.prop('scrollTopMax') == messageContainer.prop('scrollTop') ){
        //Scroll to bottom
        hideUnreadMessages();
    }
});

function showUnreadMessages(){
    unreadMessagesContainer.text(unreadMessages);
    unreadMessagesContainer.fadeIn(); 
}

function hideUnreadMessages() {
    unreadMessagesContainer.fadeOut();
    unreadMessages = 0;
    unreadMessagesContainer.text(unreadMessages);
}
/*
Only scroll when we are somewhat near to the last message.
If we are reading archive messages we don't need to scroll down
*/
function scrollToBottom(){
    var clientHeight = messageContainer.prop('clientHeight');
    var scrollTop = messageContainer.prop('scrollTop');
    var scrollHeight = messageContainer.prop('scrollHeight');
    var newMessage = messageContainer.children('li:last-child');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight ){
        messageContainer.scrollTop(scrollHeight);
        hideUnreadMessages();
    }else{
        if ( clientHeight + scrollTop != scrollHeight){
            unreadMessages++;
            showUnreadMessages();    
        }
    }
}
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
    scrollToBottom();
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
    scrollToBottom();
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