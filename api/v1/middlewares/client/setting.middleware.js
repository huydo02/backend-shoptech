const SettingModel = require("../../models/settings.model");
// const createTreeHelper = require('../../helpers/createTree.helper');
module.exports.settingGeneral = async (req, res, next) => {
    const settingGeneral = await SettingModel.findOne({});

    res.locals.settingGeneral = settingGeneral;

    next();
} 