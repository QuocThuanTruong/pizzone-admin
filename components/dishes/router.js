var express = require('express');
var router = express.Router();
const dishesController = require('./controller');

/* GET home page. */
router.get('/', dishesController.index);
router.post('/', dishesController.delete)

router.get('/update/:id', dishesController.update)
/*router.post('/update/:id', dishesController.updateInfo)*/
router.get('/add', dishesController.add)
router.post('/add', dishesController.addInfo)

module.exports = router;
