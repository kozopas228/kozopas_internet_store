const axios = require('axios');
const config = require('../config');
const httpStatusCodes = require('../../consts/httpStatusCodes');
const Assert = require('assert');
const chance = require('chance').Chance();

const baseUrl = config.baseUrl;
const apiUrl = config.apiUrl;
const basketRoute = config.basketRoute;
const authRoute = config.authRoute;
const port = config.applicationPort;
const authPort = config.authPort;

const url = `${baseUrl}:${port}${apiUrl}${basketRoute}`;
const authUrl = `${baseUrl}:${authPort}${apiUrl}${authRoute}`;

let username;
let userPassword;
let jwt;
let basketId;

describe('/createBasket', () => {
    const path = url + '/createBasket';

    test('POST without auth headers should return error with status code', async () => {
        try {
            await axios.post(path, {});
            Assert.fail('error has not been thrown');
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });

    test('correct data should create a new basket', async () => {
        const response = await axios.post(path, {}, {
            headers: {'authorization': `Bearer ${jwt}`}
        });

        const {insertId} = response.data;

        expect(insertId).not.toBeNull();
        basketId = insertId;
    });
});

describe('/getBasketById', () => {
    const path = url + '/getBasketById';

    test('correct data should create a new basket', async () => {
        const response = await axios.get(path, {
            headers: {'authorization': `Bearer ${jwt}`}
        });

        const {insertId} = response.data;

        expect(insertId).not.toBeNull();
        basketId = insertId;
    });
});

describe('/addProduct', () => {
    const path = url + '/addProduct';

    test('POST without auth headers should return error with status code', async () => {
        try {
            await axios.post(path, {});
            Assert.fail('error has not been thrown');
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });

    test('correct data should add product to the basket', async () => {
        const response = await axios.post(path, {
            productId: 3
        }, {
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        });

        expect(response.data.insertId).not.toBeNull();
    });

    test('product already exists in the basket, should return error', async () => {
        try {
            await axios.post(path, {
                productId: 3
            }, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }
            });

            Assert.fail('error has not been thrown');
        } catch (e) {
            const {message} = e.response.data;
            expect(message).toBe('product already exists in basket');
        }
    });
});

describe('/changeProductQuantity', () => {
    const path = url + '/changeProductQuantity';

    test('PUT without auth headers should return error with status code', async () => {
        try {
            await axios.put(path, {});
            Assert.fail('error has not been thrown');
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });

    test('add products more than existing should throw an error', async () => {
        try {
            await axios.put(path, {
                productId: 3,
                quantity: 100000
            }, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }
            });
            Assert.fail('error has not been thrown');
        } catch (e) {
            const {message} = e.response.data;
            expect(message).toBe('not enough products');
        }
    });

    test('add products more than existing should throw an error', async () => {
        const response = await axios.put(path, {
            productId: 3,
            quantity: 5
        }, {
            headers: {
                'authorization': `Bearer ${jwt}`
            }
        });

        expect(response.status).toBe(204);
    });
});

describe('/removeProduct', () => {
    const path = url + '/removeProduct';

    test('DELETE without auth headers should return error with status code', async () => {
        try {
            await axios.delete(path + '/fuck', {});
            Assert.fail('error has not been thrown');
        } catch (error) {
            const response = error.response;
            expect(response.status).toEqual(httpStatusCodes.UNAUTHORIZED);
        }
    });

    test('product not in basket should return error', async () => {
        try {
            await axios.delete(path, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }})
            Assert.fail('error has not been thrown');
        } catch(error) {

        }
    });

    test('correct data should remove product from basket', async () => {
       const response = await axios.delete(path + '/3', {
           headers: {
               'authorization': `Bearer ${jwt}`
           }});
    });
});

beforeAll(async () => {
    await registerUser();
});

async function registerUser() {
    username = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true });
    userPassword = chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true });

    const registerResponse = await axios.post(authUrl + '/register', {
        username,
        email: username + '@mail.com',
        password: userPassword
    });

    jwt = registerResponse.data.token;
}