const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;
const Authorizer = require('../policies/wiki');

module.exports = {
    getAllWikis(req, callback){
        let result = {
            wikis: null,
            collaborations: null
        };
        return Wiki.all()
        .then((wikis) => {
            result.wikis = wikis;
            if(!req.user){
                callback(null, result);
            } else {
                Collaborator.findAll({
                    where: {
                        userId: req.user.id
                    }
                })
                .then((collabs) => {
                    result.collaborations = collabs;
                    callback(null, result);
                })
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    addWiki(newWiki, callback){
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            userId: newWiki.userId,
            username: newWiki.username,
            private: newWiki.private,
            headerImage: newWiki.headerImage,
            profileImage: newWiki.profileImage
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },

    getWiki(req, callback){
        let result = {
            wiki: null,
            collaborators: null
        };
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            result.wiki = wiki;
            if(wiki.private === true){
                Collaborator.findAll({
                    where: {
                        wikiId: wiki.id
                    }
                })
                .then((collaborators) => {
                    result.collaborators = collaborators;
                    const authorized = new Authorizer(req.user, wiki, collaborators).show();
                    if(authorized){
                        callback(null, result);
                    } else {
                        callback(401);
                    }
                })
            } else {
                callback(null, result);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();

            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        })
    },

    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback('Wiki not found');
            }
            Collaborator.findAll({
                where: {
                    wikiId: wiki.id
                }
            })
            .then((collaborators) => {
                const authorized = new Authorizer(req.user, wiki, collaborators).update();

                if(authorized){
                    wiki.update(updatedWiki, {
                        fields: Object.keys(updatedWiki)
                    })
                    .then(() => {
                        callback(null, wiki);
                    })
                    .catch((err) => {
                        callback(err);
                    });
                } else {
                    callback('Forbidden');
                }
            })
        });
    }
}