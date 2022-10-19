
const BaseRepository = require('./BaseRepository');
const Color = require('../../models/Color');

class ColorRepository extends BaseRepository {

  async getAll() {
    const sql = `
      select colors.id, colors.name, products_colors.id as productId from colors 
      inner join products_colors on colors.id = products_colors.colorId
      `;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql);

    const result = [];
    for (const item of sqlResult) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.productsIds.push(item.productId);
      } else {
        result.push(new Color(item.id, item.name, [item.productId]));
      }
    }
    return result;
  }

  async getById(id) {
    const sql = `
      select colors.id, colors.name, products_colors.id as productId from colors 
      inner join products_colors on colors.id = products_colors.colorId
      where colors.id = ?
      `;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);

    let result;
    for (const item of sqlResult) {
      let exists = result?.id == item.id;
      if (exists) {
        result.productsIds.push(item.productId);
      } else {
        result = new Color(item.id, item.name, [item.productId]);
      }
    }
    return result;
  }

  async create(object) {
    const sql = `insert into colors (name) values (?)`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [object.name]);

    return sqlResult;
  }

  async delete(id) {
    const sql = `delete from colors where id = ?`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);

    return sqlResult;
  }

  async update(object) {
    const sql = `update colors set name = ? where id = ?`;

    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [object.name, object.id]);

    return sqlResult;
  }
}

module.exports = new ColorRepository();