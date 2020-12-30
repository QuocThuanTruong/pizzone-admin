const dishModel = require('../dishes/model')

exports.index = async (req, res, next) => {

    res.render('.././components/admin/views/index', {isLogin: true});
}

exports.profile = async (req, res, next) => {

    res.render('.././components/admin/views/profile', {isLogin: true});
}