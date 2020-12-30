var express = require('express');
var router = express.Router();
const categoriesController = require('./controller');

/* GET home page. */
router.get('/dishes-categories', categoriesController.index);
router.get('/dishes-categories/add', categoriesController.add);
router.get('/dishes-categories/update/:id', categoriesController.update);


module.exports = router;
