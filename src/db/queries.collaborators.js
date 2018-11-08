const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;

module.exports = {
    addCollaborator(collaboratorEmail, wikiId, callback){
        User.findOne({
            where: {
                email: collaboratorEmail
            }
        })
        .then((user) => {
            if(!user){
                callback('User with email doesn\'t exist');
            } else {
                Collaborator.findOne({
                    where: {
                        userId: user.id,
                        wikiId: wikiId
                    }
                })
                .then((collab) => {
                    if(collab){
                        callback('Collaborator already exists');
                    } else {
                        Collaborator.create({
                            username: user.username,
                            userId: user.id,
                            wikiId: wikiId
                        })
                        .then((collab) => {
                            callback(null, collab);
                        });
                    }
                });
            }
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteCollaborator(req, callback){
        return Collaborator.findById(req.params.id)
        .then((collab) => {
            collab.destroy()
            .then((res) => {
                callback(null, collab);
            })
            .catch((err) => {
                callback(err);
            });
        })
        .catch((err) => {
            callback(err);
        });
    }
}