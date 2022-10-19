const BaseRepository = require('./BaseRepository');

class ProductSpecRepository extends BaseRepository {

  async getAll() {
    const connection = await this.getConnection();

    const sql = `select * from productspecs`;
    const [sqlResults] = await connection.query(sql);
    return sqlResults;
  }

  async getById(id) {
    const connection = await this.getConnection();

    const sql = `select * from productspecs where id = (?)`;
    const sqlResults = await connection.query(sql, id);
    return sqlResults[0];
  }

  async getAllSpecsToCertainProduct(productId) {
    const connection = await this.getConnection();

    const sql = `select * from productspecs where productId = (?)`;
    const [sqlResults] = await connection.query(sql, productId);
    return sqlResults;
  }

  async create(object) {
    const connection = await this.getConnection();

    const sql = `insert into productspecs (title, description, productId) values (?, ?, ?)`;
    const [result] = await connection.query(sql, [object.title, object.description, object.productId]);
    return [result];
  }

  async delete(id) {
    const connection = await this.getConnection();

    const sql = `delete from productspecs where id = ?`;
    const [result] = await connection.query(sql, [id]);
    return [result];
  }

  async update(object) {
    const connection = await this.getConnection();

    const sql = `update productspecs set title = ?, description = ? where id = ?`;
    const [result] = await connection.query(sql, [object.title, object.description, object.id]);
    return [result];
  }
}

module.exports = new ProductSpecRepository();