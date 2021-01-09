let express = require('express');
let router = express.Router();
const categoriesController = require('./controller');
const authController = require('../auth/controller')

/* GET home page. */
router.get('/',  authController.isLogin, categoriesController.index);
router.get('/add',  authController.isLogin, categoriesController.add);
router.get('/update/:id',  authController.isLogin, categoriesController.update);


module.exports = router;
