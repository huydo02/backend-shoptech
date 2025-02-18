const authMiddleware = require('../../middlewares/admin/auth.middleware')

const adminDashboardRoute = require("./dashboard.route");
const productListRoute = require("./product.route");
const categoryListRoute = require("./pcategory.route");
const roleRoute = require("./role.route");
const accountRoute = require("./accounts.route");
const authRoute = require("./auth.route");
const myAccountRoute = require("./my-account.route");
const settingRoute = require("./setting.route");
const ordersRoute = require("./orders.route");






const systemConfig = require("../../../../config/system");
module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard",
        // authMiddleware.requireAuth,
        adminDashboardRoute
    );
    app.use(PATH_ADMIN + "/list-product", productListRoute);
    app.use(PATH_ADMIN + "/list-category", categoryListRoute);
    // app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoute);
    app.use(PATH_ADMIN + "/roles", roleRoute);

    app.use(PATH_ADMIN + "/accounts", accountRoute);

    app.use(PATH_ADMIN + "/auth", authRoute);
    app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoute);

    app.use(PATH_ADMIN + "/orders", ordersRoute);

    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoute);


};
