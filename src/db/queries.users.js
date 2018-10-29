const User = require('./models').User;
const bcrypt = require('bcryptjs');

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
            role: newUser.role
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        })
    },

    getUser(id, callback){
        User.findById(id)
        .then((user) => {
            if(!user) {
                callback(404);
            } else {
                callback(null, user);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    upgradeUser(id, callback){
        // update role from 0 to 1
        User.findById(id)
        .then((user) => {
            user.update({
                role: 1
            })
            .then((user) => {
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            })
        })
        .catch((err) => {
            callback(err);
        })
    },

    downgradeUser(id, callback){
        User.findById(id)
        .then((user) => {
            user.update({
                role: 0
            })
            .then((user) => {
                callback(null, user);
            })
            .catch((err) => {
                callback(err);
            })
        })
        .catch((err) => {
            callback(err);
        })
    }
}