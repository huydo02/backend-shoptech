const OrdersModel = require("../../models/order.model");
const CartModel = require("../../models/carts.model");
const ProductModel = require("../../models/product.model");

const newPrice = require("../../../../helpers/newPrice.helper");
// const createTreeHelper = require('../../helpers/createTree.helper');

module.exports.index = async (req, res) => {
    try {
        const orders = (await OrdersModel.find({ deleted: false }).sort({ createdAt: "desc" }));

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
};


module.exports.patchStatus = async (req, res) => {
    try {
        const orderid = req.params.id;
        const status = req.body.status;
        console.log(req.body)
        console.log(orderid)
        await OrdersModel.updateOne({
            _id: orderid,
        }, {
            status: status,
        })

        res.json({
            status: 200,
            message: "Cập nhật trạng thái đơn hàng thành công"
        });
    } catch (error) {
        res.json({
            status: 404,
            message: "Không tìm thấy đơn hàng"
        });
    }

}
module.exports.detailOrder = async (req, res) => {
    try {
        const orderid = req.params.id;

        const order = await OrdersModel.findOne({ _id: orderid }).lean();

        const enrichedProducts = await Promise.all(
            order.products.map(async (item) => {
                const productInfo = await ProductModel.findById(item.product_id).select('title thumbnail').lean();
                return {
                    ...item, // Trường hợp bạn không sử dụng Mongoose Document
                    thumbnail: productInfo?.thumbnail || null,
                    title: productInfo?.title || 'Unknown', // Tránh lỗi nếu không tìm thấy sản phẩm
                };
            })
        );

        const updatedOrder = {
            ...order,
            products: enrichedProducts,
        };

        console.log(updatedOrder)
        res.json({
            dataOrders: updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi khi lấy dữ liệu' });
    }
};
module.exports.success = async (req, res) => {
    const orderId = req.params.orderId;

    const order = await CheckOutModel.findOne({
        _id: orderId
    })
    for (const item of order.products) {
        console.log(item)
        const itemInfo = await ProductModel.findOne({
            _id: item.product_id,
        }).select("title thumbnail");
        item.productInfo = itemInfo;

        item.priceNew = newPrice.newPriceProductDetail(item);
        // console.log("item.priceNew", item.priceNew)

        item.totalPrice = item.priceNew * item.quantity;
        // console.log(item.totalPrice)
    }

    order.orderTotalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    console.log(order);
    res.render("client/pages/cart/ordersuccess", {
        titlePage: "Hoa Don",
        order: order,

    });
}