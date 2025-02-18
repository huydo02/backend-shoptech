const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
// Configuration
cloudinary.config({
    cloud_name: 'dnsxwgnz5',
    api_key: '296644755726927',
    api_secret: 'WLKn9pqQ_8k0Rsy81FWyAUY7TzM'
});
module.exports.upload = (req, res, next) => {

    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            req.body[req.file.fieldname] = result.secure_url;
            next();
        }
        upload(req);
    } else {
        next();
    }
}