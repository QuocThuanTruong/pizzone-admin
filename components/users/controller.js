
exports.index = async (req, res, next) => {

    res.render('.././components/users/views/index', {});
}


exports.detail = async (req, res, next) => {

    res.render('.././components/users/views/detail', {isLocked: true});
}