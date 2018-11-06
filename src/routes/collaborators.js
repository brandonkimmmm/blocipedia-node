const express = require('express');
const router = express.Router();
const collaboratorController = require('../controllers/collaboratorController');

router.get('/wikis/:wikiId/collaborators/new', collaboratorController.new);

module.exports = router;