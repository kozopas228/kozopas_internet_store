const { Router } = require("express");
const router = Router();
const setAdminRoleMiddleware = require('../middlewares/setAdminRoleIdMiddleware');
const checkRoleMiddleware = require('../middlewares/checkRoleMiddleware');
const productService = require('../../logic/services/productService');
const httpStatusCodes = require('../../consts/httpStatusCodes');
const ApplicationError = require('../../logic/errors/ApplicationError');

router.post('/createNewProduct', setAdminRoleMiddleware, checkRoleMiddleware, async (req, res, next) => {
    const {name, price, brandId, typeId, colorsIds, productSpecs} = req.body;

    if(!name || !price || !brandId || !typeId || !colorsIds || !productSpecs) {
        return next(new ApplicationError('one of fields were empty'), req, res);
    }

    let image;
    if(req.files) {
        image = req.files.image;
    }

    try {
        const resultId = await productService.create(name, price, image, brandId, typeId, colorsIds, productSpecs);
        return res.status(httpStatusCodes.CREATED).json({id: resultId});
    } catch (e) {
        return next(e, req, res);
    }

});

router.post('/addProducts', setAdminRoleMiddleware, checkRoleMiddleware, async (req, res, next) => {
    const {productId, quantity} = req.body;
    if(!productId || !quantity) {
        return next(new ApplicationError('one of fields were empty', req, res));
    }

    try {
        await productService.addProducts(productId, quantity);
        return res.status(200).json({message: 'successfully updated'});
    } catch (e) {
        return next(e, req, res);
    }
});

router.get('/getAll', async (req, res, next) => {
    const {limit, page, brandId, typeId, orderBy, order} = req.query;
    try {
        const result = await productService.getAll(limit, page, brandId, typeId, orderBy, order);
        return res.json(result);
    } catch (e) {
        return next(e, req, res);
    }
});

router.get('/getById/:id', async (req, res, next) => {
    const {id} = req.params;
    if(!id) {
        return next(new ApplicationError('id was empty'), req, res);
    }

    try {
        const result = await productService.getById(id);
        return res.json(result);
    } catch(e) {
        return next(e, req, res);
    }
});

module.exports = router;