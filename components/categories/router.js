var express = require('express');
var router = express.Router();
const categoriesController = require('./controller');

/* GET home page. */
router.get('/', categoriesController.index);
router.get('/add', categoriesController.add);
router.get('/update/:id', categoriesController.update);


module.exports = router;
