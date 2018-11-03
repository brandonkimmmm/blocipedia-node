const Wiki = require('./models').Wiki;
const Authorizer = require('../policies/wiki');

module.exports = {
    getAllWikis(callback){
        return Wiki.all()
        .then((wikis) => {
            callback(null, wikis);
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
            private: newWiki.private
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },

    getWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(wiki.private === true){
                const authorized = new Authorizer(req.user, wiki).show();
                console.log('this is the authorized', authorized);
                if(authorized){
                    callback(null, wiki);
                } else {
                    callback(401);
                }
            } else {
                callback(null, wiki);
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
            const authorized = new Authorizer(req.user, wiki).update();

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
        });
    }
}