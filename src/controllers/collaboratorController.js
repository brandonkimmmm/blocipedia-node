const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {
    new(req, res, next){
        let wikiId = req.params.wikiId;
        res.render('collaborators/new', {wikiId});
    },

    create(req, res, next){
        let collaboratorEmail = req.body.collaboratorEmail;
        let wiki = {
            id: req.params.wikiId
        };
        collaboratorQueries.addCollaborator(collaboratorEmail, req.params.wikiId, (err, collab) => {
            if(err || collab == null){
                req.flash('notice', 'No user found with that email')
                res.redirect(`/wikis/${req.params.wikiId}/collaborators/new`);
            } else {
                req.flash('notice', 'Successfully added collaborator');
                res.redirect(`/wikis/${req.params.wikiId}`);
            }
        })
    }
}