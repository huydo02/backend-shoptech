const mongoose = require('mongoose');
// const generate = require('../helpers/genarate.helper');
const schema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        coppyright: String,
        facebook: String,
        youtube: String,
        zalo: String
    },
    {
        timestamps: true,
    }
);
const Settings = mongoose.model('settings', schema);

module.exports = Settings;