
exports.index = async (req, res, next) => {

    res.render('.././components/subcategories/views/index', {});
}

exports.add = async (req, res, next) => {
    res.render('.././components/subcategories/views/add')
}

exports.update = async (req, res, next) => {

    res.render('.././components/subcategories/views/update', {});
}
