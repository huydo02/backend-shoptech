const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/chat.controller');


// router.post('/add/:productId', controller.addPost);

// router.get('/', controller.index);
router.post('/new', controller.postMessage);





module.exports = router;