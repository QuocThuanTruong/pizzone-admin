
exports.index = async (req, res, next) => {

    res.render('.././components/categories/views/index', {});
}

exports.add = async (req, res, next) => {
    res.render('.././components/categories/views/add')
}

exports.update = async (req, res, next) => {

    res.render('.././components/categories/views/update', {});
}

