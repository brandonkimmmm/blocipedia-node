const collaboratorQueries = require('../db/queries.collaborators.js');

module.exports = {

    new(req, res, next){
        let collaboratorEmail = req.body.collaboratorEmail;
        let wiki = {
            id: req.params.wikiId
        };
        collaboratorQueries.addCollaborator(collaboratorEmail, req.params.wikiId, (err, collab) => {
            if(err || collab == null){
                req.flash('notice', err)
                res.redirect(`/wikis/${req.params.wikiId}`);
            } else {
                req.flash('notice', 'Successfully added collaborator');
                res.redirect(`/wikis/${req.params.wikiId}`);
            }
        })
    },

    destroy(req, res, next){
        collaboratorQueries.deleteCollaborator(req, (err, collab) => {
            if(err){
                req.flash('notice', 'You must be the owner of the wiki or an admin to delete.');
                res.redirect(`/wikis/${req.params.wikiId}`);
            } else {
                res.redirect(303, `/wikis/${req.params.wikiId}`);
            }
        })
    }
}