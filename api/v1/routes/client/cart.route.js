const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/cart.controller');


router.post('/add/:productId', controller.addPost);

router.get('/', controller.index);

router.delete('/delete/:productId', controller.remove);

router.patch('/update/:productId/:quantity', controller.update);

router.get('/cartQuantity', controller.quanTityCart);



module.exports = router;