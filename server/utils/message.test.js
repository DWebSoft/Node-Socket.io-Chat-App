const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', ()=>{

    it('should generate correct message object', () => {
        var from = 'Durgesh';
        var text = 'Hi, bro!';

        var message = generateMessage(from, text);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from,text});
    })
});

describe('generateLocationMessage', () => {
    it('should generate correct location message object', () => {
        var from = "Durgesh";
        var latitude = 10;
        var longitude = 15;
        var url = "https://www.google.com/maps?q=10,15";
        var message = generateLocationMessage(from, latitude, longitude);
        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});
