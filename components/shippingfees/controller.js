const shippingModel = require('./model')

exports.index = async (req, res, next) => {
    res.render('.././components/shippingfees/views/index');
}

exports.pagination = async (req, res, next) => {

}

exports.delete = async (req, res, next) => {

}

exports.add = async (req, res, next) => {
    res.render('.././components/shippingfees/views/add')
}

exports.confirmAdd = async (req, res, next) => {
    res.redirect('/manage-vouchers');
}


exports.update = async (req, res, next) => {
    res.render('.././components/shippingfees/views/update');
}

exports.confirmUpdate = async (req, res, next) => {

    res.redirect('/manage-vouchers')
}
