
exports.index = async (req, res, next) => {

    res.render('.././components/voucher/views/index', {});
}

exports.add = async (req, res, next) => {
    res.render('.././components/voucher/views/add')
}

exports.update = async (req, res, next) => {

    res.render('.././components/voucher/views/update', {});
}
