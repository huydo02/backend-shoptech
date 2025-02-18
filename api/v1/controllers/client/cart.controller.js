const CartModel = require("../../models/carts.model");
const ProductModel = require("../../models/product.model");
const newPrice = require("../../../../helpers/newPrice.helper");

module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    // console.log(car)
    const dataCart = await CartModel.findOne({ _id: cartId });

    if (dataCart.products.length > 0) {
        for (const item of dataCart.products) {
            const productId = item.product_id;
            const productInfo = await ProductModel.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage");

            productInfo._doc.priceNew = newPrice.newPriceProductDetail(productInfo);

            item._doc.productInfo = productInfo;
            item._doc.totalPrice = productInfo._doc.priceNew * item.quantity;
        }
    }
    // console.log(dataCart)
    dataCart._doc.totalPrice = dataCart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);
    // console.log(dataCart)

    res.json({
        // cartId: cartId
        dataCart: dataCart,
    });
}
module.exports.addPost = async (req, res) => {

    const productId = req.params.productId;
    const quantity = req.body.quantity;
    const cartId = req.body.cartId;

    const cart = await CartModel.findOne({ _id: cartId });

    //check san pham co ton tai trong gio hang thuoc cart id tren ko
    const existProductIdInCart = cart.products.find(item => item.product_id == productId);
    const product = await ProductModel.findOne({ _id: productId });
    console.log(product.stock)

    if (existProductIdInCart) {
        const newQuantity = parseInt(quantity) + existProductIdInCart.quantity;
        if (newQuantity > product.stock) {
            return res.status(400).json({
                status: "error",
                message: "Bạn đã mua vượt quá số lượng sản phẩm.",
            });
        }
        await CartModel.updateOne(
            {
                _id: cartId,
                "products.product_id": productId,

            }, {
            $set: {
                "products.$.quantity": newQuantity
            }
        });
    } else {

        const objectCart = {
            product_id: productId,
            quantity: quantity,
        }

        await CartModel.updateOne(
            {
                _id: cartId,
            },
            {
                $push: { products: objectCart }
            }
        )


    };
    // Sau khi cập nhật giỏ hàng, cần lấy lại giỏ hàng từ cơ sở dữ liệu để tính tổng số lượng sản phẩm
    const updatedCart = await CartModel.findOne({ _id: cartId });

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    const totalQuantity = updatedCart.products.reduce((sum, item) => sum + item.quantity, 0);
    // req.flash("success", "Them hang thanh cong")
    // console.log("cart", cart)
    if (updatedCart.products.length > 0) {
        for (const item of updatedCart.products) {
            const productId = item.product_id;
            const productInfo = await ProductModel.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage");

            productInfo._doc.priceNew = newPrice.newPriceProductDetail(productInfo);

            item._doc.productInfo = productInfo;
            item._doc.totalPrice = productInfo._doc.priceNew * item.quantity;
        }
    }
    // console.log(dataCart)
    updatedCart._doc.totalPrice = updatedCart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);
    res.json({
        status: "success",
        message: "Thêm sản phẩm vào giỏ hàng thành công.",
        cartItems: updatedCart.products,
        cart: totalQuantity
    })

}


module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);
    // console.log(productId, quantity)
    // console.log(req.params)
    await CartModel.updateOne(
        {
            _id: cartId,
            "products.product_id": productId,

        }, {
        $set: {
            "products.$.quantity": quantity
        }
    });
    const cart = await CartModel.findOne({
        _id: req.cookies.cartId
    })

    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
    // console.log("cart", cart)
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await ProductModel.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage stock");

            productInfo._doc.priceNew = newPrice.newPriceProductDetail(productInfo);

            item._doc.productInfo = productInfo;
            item._doc.totalPrice = productInfo._doc.priceNew * item.quantity;
        }
    }
    // console.log(dataCart)
    cart._doc.totalPrice = cart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);

    res.json({
        status: "success",
        cartItems: cart.products,
        cart: totalQuantity,
        message: "Cập nhật giỏ hàng thành công."
    });
}

module.exports.remove = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    // const quantity = req.params.quantity;
    // console.log(productId, cartId)

    await CartModel.updateOne({
        _id: cartId,
    }, {
        $pull: { products: { product_id: productId } }
    });
    const cart = await CartModel.findOne({
        _id: req.cookies.cartId
    })

    const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
        status: "success",
        cartItems: cart.products,
        cart: totalQuantity,
        message: "xóa sản phẩm trong giỏ hàng thành công."
    });
}
module.exports.quanTityCart = async (req, res) => {
    // const cart = await CartModel.findOne({
    //     _id: req.cookies.cartId
    // })
    if (!req.cookies.cartId) {
        // create new cart 
        const cart = new CartModel();
        await cart.save();
        // console.log("newcart", cart)
        const expiresCookie = 354 * 24 * 60 * 60 * 1000;
        const totalQuantity = 0;
        res.status(201).cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie),
            httpOnly: false,
            // sameSite: "lax",
        }).json({
            status: 200,
            cart: totalQuantity
        });
    } else {
        // console.log("cookies", req.cookies.cartId)
        const cart = await CartModel.findOne({
            _id: req.cookies.cartId
        })

        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        // console.log("cart", cart)
        if (cart.products.length > 0) {
            for (const item of cart.products) {
                const productId = item.product_id;
                const productInfo = await ProductModel.findOne({
                    _id: productId
                }).select("title thumbnail slug price discountPercentage stock");

                productInfo._doc.priceNew = newPrice.newPriceProductDetail(productInfo);

                item._doc.productInfo = productInfo;
                item._doc.totalPrice = productInfo._doc.priceNew * item.quantity;
            }
        }
        // console.log(dataCart)
        cart._doc.totalPrice = cart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);

        // console.log(cart)
        res.json({
            status: 200,
            cartItems: cart.products,
            cart: totalQuantity,
            // message: "Cập nhật giỏ hàng thành công."

        });

    }
    // console.log(totalQuantity)
}