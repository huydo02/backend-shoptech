const OrderModel = require('../../models/order.model');
const UserModel = require('../../models/users.model');

module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };


    const dataOrder = await OrderModel.aggregate([
        {
            $match: find
        },
        {
            $unwind: "$products"
        },
        {
            $group: {
                _id: {
                    month: { $month: "$updatedAt" },
                    year: { $year: "$updatedAt" },
                },
                totalQuantity: { $sum: "$products.quantity" }
            }
        },
        {
            $project: {
                _id: 0,
                day: {
                    $concat: [
                        { $toString: "$_id.month" },
                        "/",
                        { $toString: "$_id.year" }
                    ]
                },
                timestamp: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: 1
                    }
                },
                quantity: "$totalQuantity"
            }
        },
        {
            $sort: { timestamp: 1 } // Sắp xếp chính xác theo thời gian
        }
    ]);
    const price = await OrderModel.aggregate([
        {
            $unwind: "$products", // Tách từng sản phẩm trong đơn hàng
        },
        {
            $addFields: {
                productPrice: {
                    $multiply: [
                        "$products.price",
                        { $subtract: [1, { $divide: ["$products.discountPercentage", 100] }] },
                        "$products.quantity",
                    ],
                },
            },
        },
        {
            $group: {
                _id: {
                    // day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" },
                },
                totalPrice: { $sum: "$productPrice" }, // Tính tổng giá
            },
        },
        {
            $project: {
                _id: 0,
                day: {
                    $concat: [
                        { $toString: "$_id.month" },
                        "/",
                        { $toString: "$_id.year" }
                    ]
                },
                timestamp: {
                    $dateFromParts: {
                        year: "$_id.year",
                        month: "$_id.month",
                        day: 1
                    }
                },

                price: "$totalPrice",
            },
        },
        {
            $sort: { "monthYear": 1 }, // Sắp xếp theo ngày tăng dần
        },
    ]);

    const totalPrice = price.reduce((sum, item) => sum + item.price, 0)
    // console.log(totalPrice)
    // console.log('price', price);
    const totalOrder = await OrderModel.countDocuments(find);
    const totalUsers = await UserModel.countDocuments(find);
    res.json({
        status: 'success',
        dataOrder: dataOrder,
        totalOrder: totalOrder,
        totalUsers: totalUsers,
        totalPrice: totalPrice,
        price: price,
    });

};
