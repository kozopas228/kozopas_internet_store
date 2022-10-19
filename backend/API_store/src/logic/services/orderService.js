const basketRepository = require("../../data/repositories/basketRepository");
const orderRepository = require("../../data/repositories/orderRepository");
const productRepository = require("../../data/repositories/productRepository");
const ApplicationError = require("../errors/ApplicationError");
const orderStatuses = require("../../consts/orderStatuses");
const Order = require('../../models/Order');

class OrderService {
  async create(basketId, productsQuantities) {
    const order = new Order(0, new Date(), orderStatuses.NEW, basketId, productsQuantities);

    const basket = await basketRepository.getById(basketId);

    if (!basket) {
      throw new ApplicationError('unexisting basket');
    }

    for (const productQuantity of productsQuantities) {
      const product = await productRepository.getById(productQuantity.productId);
      if (!product) {
        throw new ApplicationError('order has one or more unexisting products');
      }
    }

    for(const productQuantity of productsQuantities) {
      const product = await productRepository.getById(productQuantity.productId);
      product.quantity -= productQuantity.quantity;
      await productRepository.update(product);
    }

    basket.productsQuantities = [];
    await basketRepository.update(basket);

    const result = await orderRepository.create(order);
    return result.insertId;
  }

  async getAllByBasketId(basketId, limit = 2, page = 1) {
    const offset = limit * page - limit;

    const basket = await basketRepository.getById(basketId);

    if (basket == null) {
      throw new ApplicationError('basket was not found');
    }

    const results = await orderRepository.getAllWithOffsetAndLimitByBasketId(basketId, offset, limit);

    return results;
  }

  async changeStatus(orderId, status) {
    const order = await orderRepository.getById(orderId);

    if (order == null) {
      throw new ApplicationError('order was not found');
    }

    if(order.status === orderStatuses.CANCELLED) {
      throw new ApplicationError('order is already cancelled');
    }

    if (!Object.values(orderStatuses).find(x => x == status)) {
      throw new ApplicationError('order status was not found');
    }

    if(status === orderStatuses.CANCELLED) {
      for(let productQuantity of order.productsQuantities) {
        const product = await productRepository.getById(productQuantity.productId);
        product.quantity += productQuantity.quantity;
        await productRepository.update(product);
      }
    }

    order.status = status;

    return await orderRepository.update(order);
  }
}

module.exports = new OrderService();
