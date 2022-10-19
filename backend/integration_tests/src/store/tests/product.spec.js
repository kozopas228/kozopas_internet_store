const axios = require('axios');
const config = require('../config');
const Assert = require('assert');

const baseUrl = config.baseUrl;
const apiUrl = config.apiUrl;
const productRoute = config.productRoute;
const authRoute = config.authRoute;
const port = config.applicationPort;
const authPort = config.authPort;

let jwt;
let productId;

const url = `${baseUrl}:${port}${apiUrl}${productRoute}`;
const authUrl = `${baseUrl}:${authPort}${apiUrl}${authRoute}`;


describe('/createNewProduct', () => {
    const path = url + '/createNewProduct';
    test('not valid product field should return error', async () => {
        try {
            await axios.post(path, {}, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }
            });
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.response.data.message).toBe('one of fields were empty');
        }
    });

    test('correct data and admin right should create a new product', async () => {
        const product = {
            name: 'new product name',
            price: 1000,
            brandId: 1,
            typeId: 1,
            colorsIds: [1, 2],
            productSpecs: [
                {title: 'test title', description: 'test description'},
                {title: 'test title 2', description: 'test description 2'},
            ]};

        const response = await axios.post(path, {...product}, {
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        });

        productId = response.data.id;

        expect(response.data.id).not.toBeNull();
        expect(response.status).toBe(201);
    });
});

describe('/addProducts', () => {
    const path = url + '/addProducts';

    test('correct data should update product quantity', async () => {
        const productId = 1;
        const quantity = 100;

        const response = await axios.post(path, {productId, quantity}, {
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        });

        expect(response.data.message).toBe('successfully updated');
    });
});


describe('/getAll', () => {
    const path = url + '/getAll';
    test('correct data should return products', async () => {

        const response = await axios.get(path);

        expect(response.data.length).toBe(2);
    });
});

describe('/getById', () => {
    const path = url + '/getById';
    test('correct data should return product', async () => {
        const response = await axios.get(path + '/1');

        expect(response.data).not.toBeNull();
    });
});


beforeAll(async () => {
    await loginAsAdmin();
});

async function loginAsAdmin() {

    const registerResponse = await axios.post(authUrl + '/login', {
        entryData: 'admin',
        password: 'admin'
    });

    jwt = registerResponse.data.token;
}

