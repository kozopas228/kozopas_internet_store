const productRepository = require('../../data/repositories/productRepository');
const basketRepository = require('../../data/repositories/basketRepository');
const productQuantityRepository = require('../../data/repositories/productQuantityRepository');

const ApplicationError = require('../errors/ApplicationError');
const Basket = require('../../models/Basket');

class BasketService {
    async getBasket(basketId) {
        const basket = await basketRepository.getById(basketId);
        if(!basket) {
            throw new ApplicationError('basket does not exist');
        }

        return basket;
    }

    async createBasket(userId) {
        const user = await basketRepository.getByUserId(userId);
        if(user) {
            throw new ApplicationError('user already has basket');
        }

        const basket = new Basket(0, userId, []);
        const result = await basketRepository.create(basket);
        return result;
    }

    async addProduct(basketId, productId) {
        const basket = await basketRepository.getById(basketId);
        if(!basket) {
            throw new ApplicationError('basket does not exist');
        }

        const product = await productRepository.getById(productId);
        if(!product) {
            throw new ApplicationError('product does not exist');
        }

        if(product.quantity < 1) {
            throw new ApplicationError('not enough products');
        }

        const foundProduct = basket.productsQuantities.find(x => x.productId == productId);
        if(foundProduct) {
            throw new ApplicationError('product already exists in basket');
        }

        return await productQuantityRepository.addProduct(basketId, productId);

    }

    async changeProductQuantity(basketId, productId, quantity) {
        const basket = await basketRepository.getById(basketId);

        if(!basket) {
            throw new ApplicationError('basket does not exist');
        }

        const foundQuantity = basket.productsQuantities.find(x => x.productId === productId);
        if(!foundQuantity) {
            throw new ApplicationError('product is not in basket');
        }

        const product = await productRepository.getById(productId);
        if(!product) {
            throw new ApplicationError('product does not exist');
        }

        if(product.quantity < quantity) {
            throw new ApplicationError('not enough products');
        }

        return await productQuantityRepository.changeProductQuantity(basketId, productId, quantity);
    }

    async removeProduct(basketId, productId) {
        const basket = await basketRepository.getById(basketId);
        if(!basket) {
            throw new ApplicationError('basket does not exist');
        }

        const product = await productRepository.getById(productId);
        if(!product) {
            throw new ApplicationError('product does not exist');
        }

        const productQuantities = await productQuantityRepository.getAllByBasketId(basketId);
        const productQuantity = productQuantities.find(x => x.productId == productId);
        if (!productQuantity) {
            throw new ApplicationError('product not in basket');
        }

        await productQuantityRepository.removeProduct(basketId, productId);
    }
}

module.exports = new BasketService();