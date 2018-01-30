const expect = require('expect');
const {Users} = require('./users.js');

describe('Users', ()=>{

    var users = new Users;

    beforeEach(() => {
        users.users = [{
            id: '1',
            name: 'Durgesh',
            room: 'Node Course'
        },{
            id: '2',
            name: 'Viru',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Rishab',
            room: 'Node Course'
        }];

    });

    it('should add new users', () => {
        var user = {
            id: '123',
            name: 'Durgesh',
            room: 'Room 1'
        };

        var users = new Users();
        users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    })


    it('should remove the user', ()=>{
        var userId = '3';
        var user = users.removeUser(userId);
        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove the user', () => {
        var userId = '44';
        var user = users.removeUser(userId);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should get user', () => {
        var userId = '3';
        var user = users.getUser(userId);
        expect(user.id).toBe(userId);
    })

    it('should not get user', () => {
        var userId = '4';
        var user = users.getUser(userId);
        expect(user).toNotExist();
    })

    it('should list all the users for node course', () => {
        var usersList = users.getUserList('Node Course');
        expect(usersList).toEqual(['Durgesh','Rishab']);
    });

    it('should list all the users for react course', () => {
        var usersList = users.getUserList('React Course');
        expect(usersList).toEqual(['Viru']);
    });
});