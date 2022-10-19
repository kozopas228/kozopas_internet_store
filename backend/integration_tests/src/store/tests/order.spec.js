const axios = require('axios');
const config = require('../config');
const httpStatusCodes = require('../../consts/httpStatusCodes');
const Assert = require('assert');
const chance = require('chance').Chance();

const baseUrl = config.baseUrl;
const apiUrl = config.apiUrl;
const orderRoute = config.orderRoute;
const basketRoute = config.basketRoute;
const authRoute = config.authRoute;
const port = config.applicationPort;
const authPort = config.authPort;

const url = `${baseUrl}:${port}${apiUrl}${orderRoute}`;
const basketUrl = `${baseUrl}:${port}${apiUrl}${basketRoute}`;
const authUrl = `${baseUrl}:${authPort}${apiUrl}${authRoute}`;

let username;
let userPassword;
let jwt;
let basketId;
let orderId;

describe('/create', () => {
    const path = url + '/create';

    test('not existing basket should return error', async () => {
        try {
            await axios.post(path, {}, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }
            });
            Assert.fail('error has not been thrown');
        } catch (e) {
            const data = e.response.data;
            expect(data.message).toBe('basket does not exist')
        }
    });

    test('empty basket should return error', async () => {
        try {
            await createBasket();

            await axios.post(path, {}, {
                headers: {
                    'authorization': `Bearer ${jwt}`
                }
            });
            Assert.fail('error has not been thrown');
        } catch (e) {
            const data = e.response.data;
            expect(data.message).toBe('cannot create an order because basket is empty')
        }
    });

    test('correct data should create new order', async () => {
        await addItemsToBasket();
        const res = await axios.post(path, {}, {headers: {'authorization': `Bearer ${jwt}`}});
        expect(res.data).not.toBeNull();
        orderId = res.data.id;
    });
});

describe('/getAllByBasketId', () => {
    const path = url + '/getAllByBasketId'
    test('correct data should return orders by basket id', async () => {
        const res = await axios.get(path, {headers: {'authorization': `Bearer ${jwt}`}});
        expect(res.data.length).toBe(1);
    });
});

describe('/cancel', () => {
    const path = url + '/cancel'

    test('correct data should return 204 code', async () => {
        const localPath = path + `/${orderId}`;

        const res = await axios.delete(localPath, {headers: {'authorization': `Bearer ${jwt}`}});
        expect(res.status).toBe(204);
    });

    test('cancel cancelled order should return error', async () => {
        try {
            const localPath = path + `/${orderId}`;

            await axios.delete(localPath, {headers: {'authorization': `Bearer ${jwt}`}});
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.response.data.message).toBe('order is already cancelled');
        }
    });
});

describe('/changeStatus', () => {
    const path = url + '/changeStatus'

    test('not admin rights should return error', async () => {
        try {
            await axios.put(path, {},{headers: {'authorization': `Bearer ${jwt}`}});
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.response.data.message).toBe('not enough rights');
        }
    });

    test('correct data should change order status', async () => {
        await addAnotherItemsToBasket();
        await createOrder();
        await loginAsAdmin();

        const response = await axios.put(path, {orderId, orderStatus: 'delivering'},{headers: {'authorization': `Bearer ${jwt}`}});
        expect(response.status).toBe(204);
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

async function createBasket() {
    const res = await axios.post(basketUrl + '/createBasket', {}, {headers: {'authorization': `Bearer ${jwt}`}});
    basketId = res.data.insertId;
}

async function addItemsToBasket() {
    await axios.post(basketUrl + '/addProduct', {productId: 1}, {headers: {'authorization': `Bearer ${jwt}`}});

}

async function addAnotherItemsToBasket() {
    await axios.post(basketUrl + '/addProduct', {productId: 2}, {headers: {'authorization': `Bearer ${jwt}`}});

}

async function createOrder() {
    const res = await axios.post(url + '/create', {}, {headers: {'authorization': `Bearer ${jwt}`}});
    orderId = res.data.id;
}

async function loginAsAdmin() {

    const registerResponse = await axios.post(authUrl + '/login', {
        entryData: 'admin',
        password: 'admin'
    });

    jwt = registerResponse.data.token;
}