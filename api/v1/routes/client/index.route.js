const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const authRouter = require("./auth.route");
const chatRouter = require("./chat.route");
const buildRouter = require("./build.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartsMiddleware = require("../../middlewares/client/carts.middleware");
const usersMiddleware = require("../../middlewares/client/users.middleware");
const settingGeneralMiddleware = require("../../middlewares/client/setting.middleware");



module.exports = (app) => {
    // app.use(categoryMiddleware.category);
    // // app.use(cartsMiddleware.carts);
    // app.use(usersMiddleware.infoUser);
    // app.use(settingGeneralMiddleware.settingGeneral);

    app.use("/", homeRouter);
    app.use("/products", productRouter);
    // app.use("/search", searchRouter);
    app.use("/cart", cartRouter);
    app.use("/checkout", checkoutRouter);
    app.use("/search", searchRouter);
    app.use("/chat", chatRouter);

    app.use("/build", buildRouter);

    app.use("/auth", authRouter);





};
