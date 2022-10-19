jest.mock('../../data/dbContext');
jest.mock('../../data/repositories/productRepository');
jest.mock('../../data/repositories/basketRepository');
jest.mock('../../data/repositories/productQuantityRepository')
const productRepository = require('../../data/repositories/productRepository');
const basketRepository = require('../../data/repositories/basketRepository');
const productQuantityRepository = require('../../data/repositories/productQuantityRepository');

const basketService = require('../../logic/services/basketService');

const Basket = require('../../models/Basket');
const ApplicationError = require('../../logic/errors/ApplicationError');
const ValidationError = require('../../logic/errors/ValidationError');
const Assert = require('assert');

describe('getBasket function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not existing basket throw an error', async () => {
        const fn = jest.fn(() => undefined);
        basketRepository.getById = fn;

        await expect(basketService.getBasket(1)).rejects.toThrow(ApplicationError);
    })

    test('existing basket return basket', async () => {
        const fn = jest.fn(() => createBasket());
        basketRepository.getById = fn;

        const result = await basketService.getBasket(1);
        expect(result).toEqual(createBasket());
    })
});

describe('createBasket function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('existing user should throw an error', async () => {
        const fn = jest.fn(() => { return {} });
        basketRepository.getByUserId = fn;

        await expect(basketService.createBasket(1)).rejects.toThrow(ApplicationError);
    });

    test('not existing user should create basket', async () => {
        const fn = jest.fn();
        basketRepository.create = fn;

        await basketService.createBasket(1);

        expect(fn).toBeCalled();
    });
});

describe('addProduct function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not existing basket should throw error', async () => {
        try {
            await basketService.addProduct(1, undefined);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('basket does not exist');
        }
    });

    test('not existing product should throw error', async () => {
        const fn = jest.fn(() => {return {}});
        basketRepository.getById = fn;

        try {
            await basketService.addProduct(1, undefined);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product does not exist');
        }
    });

    test('product quantity less than 1 should throw error', async () => {
        const fn1 = jest.fn(() => {return {}});
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => {return {quantity: 0}});
        productRepository.getById = fn2;

        try {
            await basketService.addProduct(1, undefined);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('not enough products');
        }
    });

    test('product already in basket should throw error', async () => {
        const fn1 = jest.fn(function () {
            return {
                productsQuantities: [{productId: 1}]
            };
        });
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => {return {quantity: 10}});
        productRepository.getById = fn2;

        try {
            await basketService.addProduct(1, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product already exists in basket');
        }
    });

    test('correct data should invoke addProduct method', async () => {
        const fn1 = jest.fn(() => {
            return {
                productsQuantities: []
            };
        });
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => {return {quantity: 10}});
        productRepository.getById = fn2;

        const fn3= jest.fn();
        productQuantityRepository.addProduct = fn3;

        await basketService.addProduct(1, 1);

        expect(fn3).toBeCalledWith(1, 1);
    });
});

describe('changeProductQuantity function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not existing basket should throw error', async () => {
        try {
            await basketService.changeProductQuantity(1, 1, 6);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('basket does not exist');
        }
    });

    test('product not in basket should throw error', async () => {
        const fn = jest.fn(() => createBasket());
        basketRepository.getById = fn;

        try {
            await basketService.changeProductQuantity(1, 1, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product is not in basket');
        }
    });

    test('product does not exist should throw error', async () => {
        const fn = jest.fn(() => createBasket(1, 1, [{productId: 1}]));
        basketRepository.getById = fn;

        try {
            await basketService.changeProductQuantity(1, 1, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product does not exist');
        }
    });

    test('product quantity less than requested quantity should throw error', async () => {
        const fn1 = jest.fn(() => createBasket(1, 1, [{productId: 1}]));
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => { return { quantity: 0 } });
        productRepository.getById = fn2;

        try {
            await basketService.changeProductQuantity(1, 1, 10);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('not enough products');
        }
    });

    test('correct data should invoke productQuantityRepository.changeProductQuantity', async () => {
        const fn1 = jest.fn(() => createBasket(1, 1, [{productId: 1}]));
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => { return { quantity: 10 } });
        productRepository.getById = fn2;

        const fn3 = jest.fn();
        productQuantityRepository.changeProductQuantity = fn3;

        await basketService.changeProductQuantity(1,1,1);

       expect(fn3).toBeCalledWith(1,1,1);
    });
});

describe('removeProduct function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not existing basket should throw error',async () => {
        try {
            await basketService.removeProduct(1, undefined);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('basket does not exist');
        }
    });

    test('not existing product should throw error', async () => {
        const fn = jest.fn(() => {return {}});
        basketRepository.getById = fn;

        try {
            await basketService.removeProduct(1, undefined);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product does not exist');
        }
    });

    test('product not in basket should throw error', async () => {
        const fn1 = jest.fn(() => {return {}});
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => {return {}})
        productRepository.getById = fn2;

        const fn3 = jest.fn(() => {return [{productId: 2}]});
        productQuantityRepository.getAllByBasketId = fn3;

        try {
            await basketService.removeProduct(1, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product not in basket');
        }
    });

    test('correct', async () => {
        const fn1 = jest.fn(() => {return {}});
        basketRepository.getById = fn1;

        const fn2 = jest.fn(() => {return {}})
        productRepository.getById = fn2;

        const fn3 = jest.fn(() => {return [{productId: 1}]});
        productQuantityRepository.getAllByBasketId = fn3;

        const fn4 = jest.fn();
        productQuantityRepository.removeProduct = fn4;

        await basketService.removeProduct(1, 1);

        expect(fn4).toBeCalledWith(1, 1);
    });
});

function createBasket(id = 1, userId = 1, productsQuantities = []) {
    return new Basket(id, userId, productsQuantities);
}