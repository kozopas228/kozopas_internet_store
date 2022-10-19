const BaseRepository = require('./BaseRepository');
const Order = require('../../models/Order');

class OrderRepository extends BaseRepository {
  async getById(orderId) {
    const connection = await this.getConnection();

    const sql = `
    select orders.id, orders.creationDate, orders.status, orders.basketId, products_orders.productId as productId, products_orders.quantity as quantity from orders 
    inner join baskets on baskets.id = orders.basketId
    inner join products_orders on products_orders.orderId = orders.id
    where orders.id = (?)
    order by orders.creationDate`;

    const [sqlResults] = await connection.query(sql, [orderId]);

    let result;
    for (const item of sqlResults) {
      if(result) {
        result.productsQuantities.push({productId: item.productId, quantity: item.quantity});
      } else {
        result = new Order(item.id, item.creationDate, item.status, item.basketId, [{productId: item.productId, quantity: item.quantity}]);
      }
    }
    return result;
  }

  async getAllWithOffsetAndLimitByBasketId(basketId, offset, limit) {
    const connection = await this.getConnection();

    const ordersOfUser = (await connection.query(
      `select id from orders
      where basketId = ?
      order by creationDate
      limit ?, ?;`, [basketId, offset, limit]))[0];

    const sql = `
    select orders.id, orders.creationDate, orders.status, orders.basketId, products_orders.productId as productId, products_orders.quantity as quantity from orders 
    inner join baskets on baskets.id = orders.basketId
    inner join products_orders on products_orders.orderId = orders.id
    where orders.id in (?)
    order by orders.creationDate`;

    const [sqlResults] = await connection.query(sql, [ordersOfUser.map(x => x.id)]);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if(found) {
        found.productsQuantities.push({productId: item.productId, quantity: item.quantity});
      } else {
        result.push(new Order(item.id, item.creationDate, item.status, item.basketId, [{productId: item.productId, quantity: item.quantity}]));
      }
    }
    return result;
  }

  async create(object) {
    const sql = `insert into orders (creationDate, status, basketId) values (?, ?, ?)`;

    const connection = await this.getConnection();

    const [result] = await connection.query(sql, [object.creationDate, object.status, object.basketId]);
    for (const productQuantity of object.productsQuantities) {
      await connection.query(`insert into products_orders (productId, orderId, quantity) values (?, ?, ?)`,
          [productQuantity.productId, result.insertId, productQuantity.quantity]);
    }
    return result;
  }

  async delete(id) {
    const sql = `delete from orders where id = ?`;

    const connection = await this.getConnection();
    const [result] = await connection.query(sql, [id]);
    return result;
  }

  async update(object) {
    const sql = `update orders set creationDate = ?, status = ?, basketId = ? where id = ?`;

    const connection = await this.getConnection();
    const [result] = await connection.query(sql, [object.creationDate, object.status, object.basketId, object.id]);
    return result;
  }
}

module.exports = new OrderRepository();