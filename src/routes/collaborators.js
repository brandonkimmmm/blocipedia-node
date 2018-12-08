const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaboratorController');

router.post('/wikis/:wikiId/collaborators/new', collaboratorController.new);

router.post('/wikis/:wikiId/collaborators/:id/destroy', collaboratorController.destroy);

module.exports = router;