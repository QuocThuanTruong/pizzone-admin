
exports.index = async (req, res, next) => {

    res.render('.././components/hotdeals/views/index', {});
}

exports.add = async (req, res, next) => {
    res.render('.././components/hotdeals/views/add')
}

exports.update = async (req, res, next) => {

    res.render('.././components/hotdeals/views/update', {});
}
