const adminModel = require('./model')

const dishModel = require('../dishes/model')
const formidable = require('formidable');
const fs = require('fs')
const path = require('path');
const rimraf = require('rimraf')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
});

exports.index = async (req, res, next) => {
        let limit = 10;

        let topDishes = await dishModel.getTopDish(limit)

        res.render('.././components/admin/views/index', {topDishes});
}

exports.profile = async (req, res, next) => {
        let admin = req.user;

        console.log(admin)

        res.render('.././components/admin/views/profile', admin);
}

exports.updateProfile = async (req, res, next) => {
        fs.mkdirSync(path.join(__dirname, '..', 'tempImages'), { recursive: true })
        const form = formidable({multiples: true, keepExtensions: true, uploadDir : path.join(__dirname, '..', 'tempImages')})

        let oldUser = req.user

        await form.parse(req, async (err, fields, files) => {
                if (err) {
                        return
                }

                let newUser = adminModel.modify(fields, req.params.id)
                newUser.user_id = oldUser.user_id;

                const avatarPicker = files.avatarPicker
                if (avatarPicker) {
                        if (avatarPicker.name) {
                                await cloudinary.uploader.upload(avatarPicker.path,
                                    {
                                            folder: 'WebFinalProject/Images/user/'+newUser.user_id,
                                            public_id: 'avatar',
                                            overwrite: true
                                    }, (err, res) => {
                                            newUser.avatar = res.secure_url
                                    })
                        }
                        else {
                                newUser.avatar = ""
                        }
                } else {
                        newUser.avatar = oldUser.avatar
                }

                fs.rmdirSync(path.join(__dirname, '..', 'tempImages'), {recursive: true})

                console.log(newUser)

                const _ = await adminModel.update(newUser)
                const user = await adminModel.getUserById(newUser.user_id)

                req.login(user, {}, function(err) {
                        if (err) {
                                console.log(err)
                        }

                        res.render('./../components/admin/views/profile', user);
                })
        })
}