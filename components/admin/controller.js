const adminModel = require('./model')
const orderModel = require('../orders/model')

const dishModel = require('../dishes/model')
const formidable = require('formidable');
const morris = require('morris')
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
        let totalDishes = await  orderModel.getAllDishes();
        let totalOrders = await orderModel.getAllOrder()
        let todayRevenue = await  orderModel.getAllRevenueToday()
        let totalRevenue = await orderModel.getAllRevenue()

        let years = await orderModel.getAllYear()

        console.log(years[0].total)


        let year1 = {name: years[2].total.toString(), value: await orderModel.getRevenueByYear(parseInt(years[2].total))}
        let year2 = {name: years[1].total.toString(), value: await orderModel.getRevenueByYear(parseInt(years[1].total))}
        let year3 = {name: years[0].total.toString(), value: await orderModel.getRevenueByYear(parseInt(years[0].total))}




        let jan = await orderModel.getRevenueByMonth(1, parseInt(years[0].total))
        let feb = await orderModel.getRevenueByMonth(2, parseInt(years[0].total))
        let mar = await orderModel.getRevenueByMonth(3, parseInt(years[0].total))
        let apr = await orderModel.getRevenueByMonth(4, parseInt(years[0].total))
        let may = await orderModel.getRevenueByMonth(5, parseInt(years[0].total))
        let jun = await orderModel.getRevenueByMonth(6, parseInt(years[0].total))
        let jul = await orderModel.getRevenueByMonth(7, parseInt(years[0].total))
        let agu = await orderModel.getRevenueByMonth(8, parseInt(years[0].total))
        let sep = await orderModel.getRevenueByMonth(9, parseInt(years[0].total))
        let oct = await orderModel.getRevenueByMonth(10,parseInt(years[0].total))
        let nov = await orderModel.getRevenueByMonth(11,parseInt(years[0].total))
        let dec = await orderModel.getRevenueByMonth(12,parseInt(years[0].total))

        console.log(jan)

        let months = {jan, feb, mar, apr, may, jun, jul, agu, sep, oct, nov, dec}

        console.log(months)

        res.render('.././components/admin/views/index', {topDishes, totalDishes, totalOrders, todayRevenue, totalRevenue, year1, year2, year3, months});
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