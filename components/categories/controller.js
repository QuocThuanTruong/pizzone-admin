
exports.index = async (req, res, next) => {

    res.render('.././components/categories/views/index', {isLogin: true});
}

exports.add = async (req, res, next) => {
    res.render('.././components/categories/views/add', {isLogin: true})
}

exports.update = async (req, res, next) => {

    res.render('.././components/categories/views/update', {isLogin: true});
}

