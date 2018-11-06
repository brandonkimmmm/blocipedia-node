const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {
    new(req, res, next){
        let wikiId = req.params.wikiId;
        res.render('collaborators/new', {wikiId});
    }
}