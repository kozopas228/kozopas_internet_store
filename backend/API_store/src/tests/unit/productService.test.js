jest.mock('../../data/dbContext');
jest.mock('../../data/repositories/productRepository');
jest.mock('../../data/repositories/productSpecRepository');
jest.mock('../../data/repositories/brandRepository');
jest.mock('../../data/repositories/colorRepository');
jest.mock('../../data/repositories/typeRepository');
jest.mock('axios');
const productRepository = require('../../data/repositories/productRepository');
const brandRepository = require('../../data/repositories/brandRepository');
const typeRepository = require('../../data/repositories/typeRepository');

const productService = require('../../logic/services/productService');
const Assert = require('assert');
const axios = require('axios');

describe('create function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not valid object fields should throw an error', async () => {
        const product = {
            name: 'err',
            price: -100,
        };

        try {
            await productService.create(product.name, product.price, undefined, undefined, undefined, '{}', '{}');
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.constructor.name).toBe('ValidationError');
        }
    });

    test('not existing brand should throw error', async () => {
        const product = {
            name: 'correct name',
            price: 100,
        };

        try {
            await productService.create(product.name, product.price, undefined, undefined, undefined, '{}', '{}');
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('brand does not exist');
        }
    });

    test('not existing type should throw error', async () => {
        const product = {
            name: 'correct name',
            price: 100,
            brandId: 1
        };

        brandRepository.getById = () => {return {}};

        try {
            await productService.create(product.name, product.price, undefined, product.brandId, undefined, '{}', '{}');
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('type does not exist');
        }
    });

    test('not existing color should throw error', async () => {
        const product = {
            name: 'correct name',
            price: 100,
            brandId: 1,
            typeId: 1
        };

        brandRepository.getById = () => {return {}};
        typeRepository.getById = () => {return {}};

        try {
            await productService.create(product.name, product.price, undefined, product.brandId, product.typeId, '[1]', '{}');
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('color does not exist');
        }
    });

    test('empty image should add correct image name to the object', async () => {
        const product = {
            name: 'correct name',
            price: 100,
            brandId: 1,
            typeId: 1
        };

        let obj;
        const fn = jest.fn((object) => {
            obj = object;
            return {insertId: 123};
        });
        productRepository.create = fn;
        brandRepository.getById = () => {return {}};
        typeRepository.getById = () => {return {}};

        await productService.create(product.name, product.price, undefined, product.brandId, product.typeId, '[]', '[]');

        expect(fn).toBeCalled();
        expect(obj.image).toBe('NONE');
    });

    test('correct data should invoke axios', async () => {
        const product = {
            name: 'correct name',
            price: 100,
            brandId: 1,
            typeId: 1,
            image: {
                data: 'data.img'
            }
        };

        const fn = jest.fn(() => {return {data: 'result_data'}});
        axios.post = fn;

        let obj;
        const fn2 = jest.fn((object) => {
            obj = object;
            return {insertId: 123};
        });
        productRepository.create = fn2;

        brandRepository.getById = () => {return {}};
        typeRepository.getById = () => {return {}};

        await productService.create(product.name, product.price, product.image, product.brandId, product.typeId, '[]', '[]');

        expect(fn).toBeCalled();
        expect(obj.image).toBe('result_data');
    });
});

describe('addProducts function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('not existing product should throw error', async() => {
        try {
            await productService.addProducts(1, 1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('product does not exist');
        }

    });

    test('correct data should increase product quantity', async () => {
        const product = {quantity: 10, id: 1};
        productRepository.getById = jest.fn(() => product);

        await productService.addProducts(product.id, 5);

        expect(product.quantity).toBe(15);
    });

});

describe('getAll function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('all data set should invoke productRepository.getAllByOffsetWithLimitAndFiltration with correct params', async () => {
        const limit = 10;
        const page = 5;
        const brandId = 3;
        const typeId = 4;
        const orderBy = 'name';
        const order = 'desc';

        const fn = jest.fn();
        productRepository.getAllByOffsetWithLimitAndFiltration = fn;

        await productService.getAll(limit, page, brandId, typeId, orderBy, order);

        const offset = 40;
        const resultString = `where brandId = ${brandId} and typeId = ${typeId}`;

        expect(fn).toBeCalledWith(offset, limit, resultString, orderBy, order);
    });

    test('none of data is set should invoke productRepository.getAllByOffsetWithLimit with correct params', async () => {
        const fn = jest.fn();
        productRepository.getAllByOffsetWithLimit = fn;

        await productService.getAll();

        expect(fn).toBeCalledWith(0, 2, 'name', 'desc');
    });

});

describe('getById function', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('id not set should throw error', async () => {
        try {
            await productService.getById(1);
            Assert.fail('error has not been thrown');
        } catch (e) {
            expect(e.message).toBe('object was not found');
        }
    });
});