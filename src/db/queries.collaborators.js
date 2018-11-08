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
                callback(null);
            } else {
                Collaborator.create({
                    username: user.username,
                    userId: user.id,
                    wikiId: wikiId
                })
                .then((collab) => {
                    callback(null, collab);
                })
            }
        })
        .catch((err) => {
            callback(err);
        })
    }
}