const { Router } = require("express");
const router = Router();
const setAdminRoleMiddleware = require('../middlewares/setAdminRoleIdMiddleware');
const checkRoleMiddleware = require('../middlewares/checkRoleMiddleware');
const authorizationMiddleware = require('../middlewares/authMiddleware');
const basketService = require('../../logic/services/basketService');
const orderService = require('../../logic/services/orderService');
const httpStatusCodes = require('../../consts/httpStatusCodes');
const orderStatuses = require('../../consts/orderStatuses');
const ApplicationError = require('../../logic/errors/ApplicationError');

router.get('/getAllByBasketId', authorizationMiddleware, async (req, res, next) => {
    const basketId = req.user.basketId;
    const {limit, page} = req.body;

    try {
        const result = await orderService.getAllByBasketId(basketId, limit, page);
        return res.json(result);
    } catch (e) {
        return next(e, req, res);
    }
});

router.post('/create', authorizationMiddleware, async (req, res, next) => {
    const basketId = req.user.basketId;

    try {
        const basket = await basketService.getBasket(basketId);
        if(basket.productsQuantities.length === 0) {
            throw new ApplicationError('cannot create an order because basket is empty');
        }
        const result = await orderService.create(basketId, basket.productsQuantities);
        return res.status(httpStatusCodes.CREATED).json({id: result});
    } catch (e) {
        return next(e, req, res);
    }
});

router.delete('/cancel/:orderId', authorizationMiddleware, async (req, res, next) => {
    const {orderId} = req.params;

    if(!orderId) {
        return next(new ApplicationError('orderId was not set'), req, res);
    }

    try {
        await orderService.changeStatus(orderId, orderStatuses.CANCELLED);
        return res.status(httpStatusCodes.NO_CONTENT).send('changed');
    } catch (e) {
        return next(e, req, res);
    }
});

router.put('/changeStatus', setAdminRoleMiddleware, checkRoleMiddleware, async (req, res, next) => {
    const {orderId, orderStatus} = req.body;

    if(!orderId || !orderStatus) {
        return next(new ApplicationError('one of fields were empty'), req, res);
    }

    try {
        await orderService.changeStatus(orderId, orderStatus);
        return res.status(httpStatusCodes.NO_CONTENT).send('changed');
    } catch (e) {
        return next(e, req, res);
    }
});

module.exports = router;