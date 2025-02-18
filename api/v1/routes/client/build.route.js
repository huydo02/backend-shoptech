const controller = require('../../controllers/client/build.controller');
const express = require('express');
const router = express.Router();

// router.get('/', controller.index);
router.get('/categories', controller.getCategories);

router.get('/categories/:slugParent', controller.setSlugParent);

router.get('/', controller.build);

router.post('/add', controller.addBuild);
router.get('/add-to-cart', controller.addToCart);
router.delete('/remove-build', controller.removeAllBuild);


router.delete('/remove', controller.removeBuild);




module.exports = router;