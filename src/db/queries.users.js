const User = require('./models').User;
const Wiki = require('./models').Wiki;
const bcrypt = require('bcryptjs');

module.exports = {
    createUser(newUser, callback){
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            username: newUser.username,
            email: newUser.email,
            password: hashedPassword,
            role: newUser.role,
            profileImage: newUser.profileImage
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
        let result = {};
        User.findById(id)
        .then((user) => {
            if(!user) {
                callback(404);
            } else {
                result.user = user;
                Wiki.scope({method: ['lastFiveFor', id]}).all()
                .then((wikis) => {
                    result.wikis = wikis;
                    callback(null, result);
                })
                .catch((err) => {
                    callback(err);
                })
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
        this.user;
        User.findById(id)
        .then((user) => {
            user.update({
                role: 0
            })
            .then((user) => {
                this.user = user;
                Wiki.update({
                    private : false
                }, {
                    where: {
                        userId: id,
                        private: true
                    }
                })
                .then((res) => {
                    console.log('these are the res', res);
                    callback(null, this.user);
                })
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