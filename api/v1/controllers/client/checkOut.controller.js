const CheckOutModel = require("../../models/order.model");
const CartModel = require("../../models/carts.model");
const ProductModel = require("../../models/product.model");

const newPrice = require("../../../../helpers/newPrice.helper");
// const createTreeHelper = require('../../helpers/createTree.helper');

module.exports.index = async (req, res) => {

    const cartId = req.cookies.cartId;
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
    dataCart._doc.totalPrice = dataCart.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);
    // console.log(dataCart)

    res.json({ dataCart: dataCart })

}


module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    // console.log(req.body)
    const cart = await CartModel.findOne({
        _id: cartId,
    })

    const products = [];

    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity,
        };

        const productInfo = await ProductModel.findOne({
            _id: product.product_id,
        }).select("price discountPercentage");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct);
    }
    // console.log(cartId)
    // console.log(products)
    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }
    // console.log("orderInfo", orderInfo)
    const order = new CheckOutModel(orderInfo);

    order.save();
    console.log(order, order)
    await CartModel.updateOne({
        _id: cartId
    }, {
        products: []
    });

    res.json({
        status: 'success',
        message: 'Mua hàng thành công.',
        orderId: order._id,
    });
}

module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;

    const order = await CheckOutModel.findOne({
        _id: orderId
    })
    console.log('order', orderId)
    for (const item of order.products) {
        console.log(item)
        const itemInfo = await ProductModel.findOne({
            _id: item.product_id,
        }).select("title thumbnail");
        item._doc.productInfo = itemInfo;

        item._doc.priceNew = newPrice.newPriceProductDetail(item);
        // console.log("item.priceNew", item.priceNew)

        item._doc.totalPrice = item._doc.priceNew * item.quantity;
        // console.log(item.totalPrice)

    }

    order._doc.orderTotalPrice = order.products.reduce((sum, item) => sum + item._doc.totalPrice, 0);
    console.log(order);
    res.json({
        status: 'success',
        order: order,

    });
}

module.exports.orderHistory = async (req, res) => {
    // const orderId = req.params.orderId;

    try {
        const cartId = req.cookies.cartId;
        const orders = await CheckOutModel.find({
            cart_id: cartId,
        })

        const updatedOrders = await Promise.all(
            orders.map(async (order) => {
                const enrichedProducts = await Promise.all(
                    order.products.map(async (item) => {
                        const productInfo = await ProductModel.findById(item.product_id).select('title thumbnail');
                        return {
                            ...item._doc,
                            thumbnail: productInfo.thumbnail,
                            title: productInfo.title,// Thêm thông tin sản phẩm
                        };
                    })
                );

                return {
                    ...order.toObject(), // Chuyển đổi đối tượng Mongoose thành JSON
                    products: enrichedProducts,
                };
            })
        );
        // console.log(updatedOrders)
        res.json({
            dataOrders: updatedOrders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
    }
}