const SettingsModel = require('../../models/settings.model');
const systemConfig = require('../../../../config/system');

module.exports.index = async (req, res) => {
    // const find = {
    //     deleted: false,
    // };
    const settingsGeneral = await SettingsModel.findOne({});

    res.render("admin/pages/setting/index", {
        titlePage: "Cài đặt chung",
        settingsGeneral: settingsGeneral
    });
}

module.exports.settingGeneralPost = async (req, res) => {
    // console.log(req.body)
    const settingsGeneral = await SettingsModel.findOne({});
    const data = {
        websiteName: req.body.websiteName,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        coppyright: req.body.coppyright,
        logo: req.body.thumbnail
    }
    if (settingsGeneral) {
        await SettingsModel.updateOne({
            _id: settingsGeneral.id
        }, data)
    } else {
        const settings = new SettingsModel(req.body);
        settings.save();
    }

    res.redirect("back");
}
