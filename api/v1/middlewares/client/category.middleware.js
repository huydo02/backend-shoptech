const CategoriesModel = require("../../models/categories.model");
const createTreeHelper = require('../../../../helpers/createTree.helper');
module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false,
    };

    const categories = await CategoriesModel.find(find)
    const categoriesNew = createTreeHelper.tree(categories);

    res.locals.tree = categoriesNew;
    // res.json(categoriesNew);
    // console.log(categoriesNew);

    next();
} 