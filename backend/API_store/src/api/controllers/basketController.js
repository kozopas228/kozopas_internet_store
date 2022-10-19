const { Router } = require("express");
const ApplicationError = require('../../logic/errors/ApplicationError');
const basketService = require('../../logic/services/basketService');
const router = Router();
const authorizationMiddleware = require('../middlewares/authMiddleware');
const httpStatusCodes = require('../../consts/httpStatusCodes');

router.post('/createBasket', authorizationMiddleware, async (req, res, next) => {
    const userId = req.user.id;

    if(!userId) {
        next(new ApplicationError('userId field was empty'), req, res);
    }

    try {
        const basket = await basketService.createBasket(userId);
        return res.json(basket);
    } catch (e) {
        next(e, req, res);
    }
});

router.get('/getBasketById', authorizationMiddleware, async (req, res, next) => {
    const {basketId} = req.user;

    if(!basketId) {
        next(new ApplicationError('basketId field was empty'), req, res);
    }

    try {
        const basket = await basketService.getBasket(basketId);
        return res.json(basket);
    } catch (e) {
        next(e, req, res);
    }
});

router.post('/addProduct', authorizationMiddleware, async (req, res, next) => {
    const {productId} = req.body;
    const basketId = req.user.basketId;

    if(!productId) {
        return next(new ApplicationError('one of fields were empty'), req, res);
    }

    try {
        const result = await basketService.addProduct(basketId, productId);
        return res.status(httpStatusCodes.CREATED).json(result);
    } catch (e) {
        return next(e, req, res);
    }
});

router.put('/changeProductQuantity', authorizationMiddleware, async (req, res, next) => {
    const {productId, quantity} = req.body;
    const basketId = req.user.basketId;

    if(!basketId || !productId || !quantity) {
        return next(new ApplicationError('one of fields were empty'), req, res);
    }

    try {
        const result = await basketService.changeProductQuantity(basketId, productId, quantity);
        return res.status(httpStatusCodes.NO_CONTENT).json(result);
    } catch (e) {
        return next(e, req, res);
    }
});

router.delete('/removeProduct/:id', authorizationMiddleware, async (req, res, next) => {
    const productId = req.params.id;
    const basketId = req.user.basketId;


    if(!productId) {
        return next(new ApplicationError('one of fields were empty'), req, res);
    }
    try {
        const result = await basketService.removeProduct(basketId, productId);
        return res.status(httpStatusCodes.NO_CONTENT).json(result);
    } catch (e) {
        return next(e, req, res);
    }
});

module.exports = router;