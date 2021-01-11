let express = require('express');
let router = express.Router();
const authController = require('./controller');
const passport = require('./passport')
const api = require('../admin/api')

/* GET home page. */
router.get('/', authController.signIn)

router.get('/recover-password',  authController.isLogin, authController.recoverPassword);

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true })
);

router.get('/logout', authController.isLogin, authController.logout)

router.get('/api/is-exist/:username', api.isExistsAPI)

router.get('/api/check-user', api.checkUserAPI)


module.exports = router;
