const { Router } = require("express");
const router = Router();
const orderController = require('./controllers/orderController');
const productController = require('./controllers/productController');
const basketController = require('./controllers/basketController');

router.use('/order', orderController);
router.use('/product', productController);
router.use('/basket', basketController);

module.exports = router;
