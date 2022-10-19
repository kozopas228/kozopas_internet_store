const BaseRepository = require('./BaseRepository');
const productQuantityRepository = require('./productQuantityRepository');
const Basket = require('../../models/Basket');

class BasketRepository extends BaseRepository {
  async getAll() {
    const sql = `
      select baskets.id, users.id as userId from baskets 
      inner join kozopas_internet_store_authorization.users on kozopas_internet_store_authorization.users.id = baskets.userId
    `;
    const connection = await this.getConnection();
    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      result.push(new Basket(item.id, item.userId));
    }

    return result;
  }

  async getById(id) {
    let sql = `
      select baskets.id, users.id as userId from baskets 
      inner join kozopas_internet_store_authorization.users on users.id = baskets.userId
      where baskets.id = ?
    `;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);

    if (sqlResult.length == 0) {
      return undefined;
    }

    let productQuantities = await productQuantityRepository.getAllByBasketId(id);
    if(!productQuantities) {
      productQuantities = [];
    }
    const result = new Basket(sqlResult[0].id, sqlResult[0].userId, productQuantities);
    return result;
  }

  async getByUserId(userId) {
    const sql = `
      select baskets.id, users.id as userId from baskets 
      inner join kozopas_internet_store_authorization.users on users.id = baskets.userId
      where users.id = (?);`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [userId]);

    if (sqlResult.length == 0) {
      return undefined;
    }

    const result = new Basket(sqlResult[0].id, sqlResult[0].userId);
    return result;
  }

  async create(object) {
    const sql = `insert into baskets (userId) values (?)`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [object.userId]);

    return sqlResult;
  }

  async delete(id) {
    const sql = `delete from baskets where id = ?`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);

    return sqlResult;
  }

  async update(object) {
    const sql = `update baskets set userId = ? where id = ?`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [object.userId, object.id]);

    return sqlResult;
  }
}

const repository = new BasketRepository();

module.exports = repository;