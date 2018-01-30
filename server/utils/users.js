class Users{
    constructor () {
        this.users = [];
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        //return the removed user
        var user = this.getUser(id);
        // var index = this.users.indexOf(user[0]);
        // if( index != -1){
        //     return this.users.splice(index, 1);
        // }
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room){
        //Filter user by room
        var users = this.users.filter((user) => {
            return user.room === room;
        })

        var namesArray = users.map((user) => {
            return user.name;
        })

        return namesArray;
    }
}

module.exports = {Users};