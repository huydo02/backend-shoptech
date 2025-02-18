const CartsModel = require("../../models/carts.model");
// const createTreeHelper = require('../../helpers/createTree.helper');
module.exports.carts = async (req, res, next) => {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    if (!req.cookies.cartId) {
        // create new cart 
        const cart = new CartsModel();
        await cart.save();
        console.log("newcart", cart)
        const expiresCookie = 354 * 24 * 60 * 60 * 1000;

        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie),
            httpOnly: false,
            // sameSite: "lax",
        });
    } else {
        const cart = await CartsModel.findOne({
            _id: req.cookies.cartId
        })

        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        res.locals.miniCart = cart;
        console.log(res.header)
    }
    next();
} 