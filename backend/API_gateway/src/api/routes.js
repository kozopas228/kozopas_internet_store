const { Router } = require("express");
const router = Router();
const config = require('../config');
const storeUrl = config.storeUrl + '/api';
const authorizationUrl = config.authorizationUrl + '/api/user';
const cdnUrl = config.cdnUrl;
const axios = require('axios');
const httpStatusCodes = require('../consts/httpStatusCodes');
const FormData = require('form-data');


router.use('/user',
    router.post("/register", async (req, res) => {
        try {
            const response = await axios.post(authorizationUrl + "/register", {...req.body});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post("/login", async (req, res) => {
        try {
            const response = await axios.post(authorizationUrl + "/login", {...req.body});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.get('/check', async(req, res) => {
        try {
            const response = await axios.get(authorizationUrl + '/check', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/changeUsername', async(req, res) => {
        try {
            const response = await axios.post(authorizationUrl + '/changeUsername', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/changeEmail', async(req, res) => {
        try {
            const response = await axios.post(authorizationUrl + '/changeEmail', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/changePassword', async(req, res) => {
        try {
            const response = await axios.post(authorizationUrl + '/changePassword', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/changeRoles', async(req, res) => {
        try {
            const response = await axios.post(authorizationUrl + '/changeRoles', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),
);


router.use('/order',
    router.get('/getAllByBasketId', async(req, res) => {
        try {
            const response = await axios.get(storeUrl + '/order' + '/getAllByBasketId', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/create', async(req, res) => {
        try {
            const response = await axios.post(storeUrl + '/order' + '/create', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.delete('/cancel/:orderId', async(req, res) => {
        try {
            const {orderId} = req.params;
            const response = await axios.delete(storeUrl + '/order' + '/cancel/' + orderId, {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.put('/changeStatus', async(req, res) => {
        try {
            const response = await axios.put(storeUrl + '/order' + '/changeStatus', {...req.body},{headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),
);
router.use('/product',
    router.post('/createNewProduct', async(req, res) => {
        try {
            const image = req.files?.image;
            if (image) {
                const formData = new FormData();
                formData.append('image', image.data);

                for(let key of Object.keys(req.body)) {
                    formData.append(key, req.body[key]);
                }

                const response = await axios.post(storeUrl + '/product' + '/createNewProduct', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization': req.get('authorization')
                    }
                });

                return res.status(response.status).json(response.data);
            } else {
                const response = await axios.post(storeUrl + '/product' + '/createNewProduct', {...req.body},{headers: {authorization: req.get('authorization')}});
                return res.status(response.status).json(response.data);
            }
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/addProducts', async(req, res) => {
        try {
            const response = await axios.post(storeUrl + '/product' + '/addProducts', {...req.body},{headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.get('/getAll', async (req, res) => {
        try {
            const response = await axios.get(storeUrl + '/product' + '/getAll');
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.get('/getById/:id', async (req, res) => {
        try {
            const {id} = req.params;
            const response = await axios.delete(storeUrl + '/product' + '/getById/' + id);
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),);



router.use('/basket',
    router.post('/createBasket', async (req, res) => {
        try {
            const response = await axios.post(storeUrl + '/basket' + '/createBasket', {...req.body},{headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.get('/getBasketById', async (req, res) => {
        try {
            const response = await axios.post(storeUrl + '/basket' + '/getBasketById', {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.post('/addProduct', async (req, res) => {
        try {
            const response = await axios.post(storeUrl + '/basket' + '/addProduct', {...req.body},{headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.put('/changeProductQuantity', async (req, res) => {
        try {
            const response = await axios.put(storeUrl + '/basket' + '/changeProductQuantity', {...req.body},{headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    }),

    router.delete('/removeProduct/:id', async(req, res) => {
        try {
            const {id} = req.params;
            const response = await axios.delete(storeUrl + '/basket' + '/removeProduct/' + id, {headers: {authorization: req.get('authorization')}});
            return res.status(response.status).json(response.data);
        } catch (e) {
            const response = e.response;
            return res.status(response.status).json(response.data);
        }
    })

);

module.exports = router;
