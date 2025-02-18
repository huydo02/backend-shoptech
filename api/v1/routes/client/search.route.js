const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/fillter.controller');
router.get('/', controller.index);
router.get('/live', controller.live);


module.exports = router;