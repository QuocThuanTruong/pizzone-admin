
exports.signIn = async (req, res, next) => {

    res.render('.././components/auth/views/signIn', {isLogin: false});
}

exports.recoverPassword = async (req, res, next) => {
    res.render('.././components/auth/views/recoverPassword')
}

