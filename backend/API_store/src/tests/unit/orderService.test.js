jest.mock('../../data/dbContext');
jest.mock('../../data/repositories/basketRepository');
jest.mock('../../data/repositories/orderRepository');
jest.mock('../../data/repositories/productRepository')
const basketRepository = require("../../data/repositories/basketRepository");
const orderRepository = require("../../data/repositories/orderRepository");
const productRepository = require("../../data/repositories/productRepository")
const ApplicationError = require("../../logic/errors/ApplicationError");
const orderStatuses = require("../../consts/orderStatuses");
const Order = require('../../models/Order');

const orderService = require('../../logic/services/orderService');
const Assert = require('assert');


describe('create function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('unexising basket should throw error', async () => {
        try {
            const fn = jest.fn(() => undefined);
            basketRepository.getById = fn;

            await orderService.create(1, []);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('unexisting basket');
        }
    });

    test('unexisting product should throw error', async () => {
        basketRepository.getById.mockReturnValue({});

        try {
            await orderService.create(1, [{productId: 1}]);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('order has one or more unexisting products');
        }
    });

    test('correct data should decrease product quantity', async () => {
        const productQuantity = {productId: 1, quantity: 3};
        const product = {id: 1, quantity: 10};

        basketRepository.getById.mockReturnValue({});
        productRepository.getById.mockReturnValue(product);
        orderRepository.create = () => {return {insertId: 228}};

        const fn = jest.fn();
        productRepository.update = fn;

        await orderService.create(1, [productQuantity]);

        expect(product.quantity).toBe(7);
        expect(fn).toBeCalledWith(product);
    });

    test('correct data should erase basket', async () => {
        const productQuantity = {productId: 1, quantity: 3};
        const product = {id: 1, quantity: 10};

        basketRepository.getById.mockReturnValue({productsQuantities: [{}, {}]});
        productRepository.getById.mockReturnValue(product);
        orderRepository.create = () => {return {insertId: 228}};

        const fn = jest.fn();
        productRepository.update = fn;

        const basket = await basketRepository.getById(1);
        expect(basket.productsQuantities.length).toBe(2);
        await orderService.create(1, [productQuantity]);
        expect(basket.productsQuantities.length).toBe(0);

    });

    test('correct data should call crete method in orderService', async () => {
        const productQuantity = {productId: 1, quantity: 3};
        const product = {id: 1, quantity: 10};

        basketRepository.getById.mockReturnValue({});
        productRepository.getById.mockReturnValue(product);

        const fn = jest.fn(() => {return {insertId: 228}});
        orderRepository.create = fn;

        await orderService.create(1, [productQuantity]);

        expect(fn).toBeCalled();

    });
});

describe('getAllByBasketId function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('basket does not exist should throw an error', async () => {
        try {
            await orderService.getAllByBasketId(1, 2, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('basket was not found');
        }
    });

    test('correct params should invoke function with correct offset and limit', async () => {
        basketRepository.getById = () => {return {}};

        const fn = jest.fn(() => {});
        orderRepository.getAllWithOffsetAndLimitByBasketId = fn;

        await orderService.getAllByBasketId(1, 10, 5);

        expect(fn).toBeCalledWith(1, 40, 10);
    });
});

describe('changeStatus function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('unexisting order should throw error', async () => {
        try {
            await orderService.changeStatus(1, orderStatuses.NEW);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('order was not found');
        }
    });

    test('cancelled order should throw error', async () => {
        orderRepository.getById = () => {return {status: orderStatuses.CANCELLED}};

        try {
            await orderService.changeStatus(1, orderStatuses.NEW);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('order is already cancelled');
        }
    });

    test('not existing order status should throw error', async () => {
        orderRepository.getById = () => {return {status: orderStatuses.NEW}};

        try {
            await orderService.changeStatus(1, 'not existing status');
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('order status was not found');
        }
    });

    test('cancel order should add quantities to product', async () => {
        const product = {quantity: 10};

        orderRepository.getById = () => {return {status: orderStatuses.NEW, productsQuantities: [{productId: 1, quantity: 3}]}};
        productRepository.getById = () => product;

        const fn = jest.fn();
        productRepository.update = fn;

        await orderService.changeStatus(1, orderStatuses.CANCELLED);

        expect(fn).toBeCalled();
        expect(product.quantity).toBe(13);
    });

    test('correct data should invoke orderRepository.update with correct order', async () => {
        const order = {status: orderStatuses.NEW};
        orderRepository.getById = () => order;

        const fn = jest.fn();
        orderRepository.update = fn;

        await orderService.changeStatus(1, orderStatuses.COMPLECTED);

        expect(fn).toBeCalled();
        expect(order.status).toBe(orderStatuses.COMPLECTED);
    });
});