const BaseMigration = require("./BaseMigration");

class Migration_2 extends BaseMigration {
  constructor(connection) {
    super(connection);

    this._types = [
      [1, 'electric guitars'],
      [2, 'acoustic guitars'],
      [3, 'bass guitars'],
    ];

    this._products = [
      [1, 'Fender Jaguar', 1350, 8, 'none', 1, 1],
      [2, 'Fender CD 60', 200, 21, 'none', 1, 2],
      [3, 'Yamaha F310', 150, 18, 'none', 2, 2],
    ];

    this._brands = [
      [1, 'Fender'],
      [2, 'Yamaha'],
    ];

    this._orders = [
      [1, new Date(), 'complecting', 1],
      [2, new Date(), 'delivering', 1],
      [3, new Date(), 'complecting', 2],
      [4, new Date(), 'complecting', 3],
    ];

    this._colors = [
      [1, 'black'],
      [2, 'red'],
      [3, 'green'],
    ];

    this._productSpecs = [
      [1, 'strings count', '6', 1],
      [2, 'strings count', '6', 2],
      [3, 'strings count', '6', 3],
      [4, 'type', 'electric', 1],
    ];

    this._baskets = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ];

    this._productsOrders = [
      [1, 1, 1],
      [2, 1, 2],
      [3, 2, 3],
      [4, 3, 4],
      [5, 2, 1],
      [6, 1, 3],
    ];

    this._productsColors = [
      [1, 1, 1],
      [2, 1, 2],
      [3, 1, 3],
      [4, 2, 1],
      [5, 3, 1],
    ];
  }

  async apply() {
    await this.initializeTypes();
    await this.initializeBrands();
    await this.initializeProducts();
    await this.initializeBaskets();
    await this.initializeOrders();
    await this.initializeColors();
    await this.initializeProductsColors();
    await this.initializeProductsOrders();
    await this.initializeProductsSpecs();
  }

  async initializeTypes() {
    const values = await this._connection.query('select * from types');

    if (values[0].length) {
      return;
    }

    let sql = `insert into types (id, name) values ?`;

    await this._connection.query(sql, [this._types]);
  }

  async initializeProducts() {
    const values = await this._connection.query('select * from products');

    if (values[0].length) {
      return;
    }

    let sql = `insert into products (id, name, price, quantity, image, brandId, typeId) values ?`;

    await this._connection.query(sql, [this._products]);
  }

  async initializeBrands() {
    const values = await this._connection.query('select * from brands');

    if (values[0].length) {
      return;
    }

    let sql = `insert into brands (id, name) values ?`;

    await this._connection.query(sql, [this._brands]);
  }

  async initializeOrders() {
    const values = await this._connection.query('select * from orders');

    if (values[0].length) {
      return;
    }

    let sql = `insert into orders (id, creationDate, status, basketId) values ?`;

    await this._connection.query(sql, [this._orders]);
  }

  async initializeColors() {
    const values = await this._connection.query('select * from colors');

    if (values[0].length) {
      return;
    }

    let sql = `insert into colors (id, name) values ?`;

    await this._connection.query(sql, [this._colors]);
  }

  async initializeBaskets() {
    const values = await this._connection.query('select * from baskets');

    if (values[0].length) {
      return;
    }

    let sql = `insert into baskets (id, userId) values ?`;

    await this._connection.query(sql, [this._baskets]);
  }


  async initializeProductsOrders() {
    const values = await this._connection.query('select * from products_orders');

    if (values[0].length) {
      return;
    }

    let sql = `insert into products_orders (id, productId, orderId) values ?`;

    await this._connection.query(sql, [this._productsOrders]);
  }

  async initializeProductsColors() {
    const values = await this._connection.query('select * from products_colors');

    if (values[0].length) {
      return;
    }

    let sql = `insert into products_colors (id, productId, colorId) values ?`;

    await this._connection.query(sql, [this._productsColors]);
  }

  async initializeProductsSpecs() {
    const values = await this._connection.query('select * from productspecs');

    if (values[0].length) {
      return;
    }

    let sql = `insert into productspecs (id, title, description, productId) values ?`;

    await this._connection.query(sql, [this._productSpecs]);
  }
}

module.exports = Migration_2;