
exports.signIn = async (req, res, next) => {
    if (!req.user) {
        res.render('.././components/auth/views/signIn', {isLogin: false});
    } else {
        res.redirect('/dashboard')
    }
}

exports.recoverPassword = async (req, res, next) => {
    res.render('.././components/auth/views/recoverPassword')
}

exports.logout = (req, res, next) => {
    req.logout()

    res.redirect('/');
}

exports.isLogin = async (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.redirect('/')
    }
}
