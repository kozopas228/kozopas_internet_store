const BaseRepository = require('./BaseRepository');
const Type = require('../../models/Type');

class TypeRepository extends BaseRepository {

  async getAll() {
    const connection = await this.getConnection();

    const sql = `
      select types.id, types.name, products.id as productId from types 
      left outer join products on types.id = products.typeId
      `;
    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.productsIds.push(item.productId);
      } else {
        result.push(new Type(item.id, item.name, [item.productId]));
      }
    }
    return result;
  }

  async getById(id) {
    const connection = await this.getConnection();

    const sql = `
      select types.id, types.name, products.id as productId from types  
      left outer join products on types.id = products.typeId
      where types.id = ?
      `;
    const [sqlResults] = await connection.query(sql, [id]);

    let result;
    for (const item of sqlResults) {
      let exists = result?.id == item.id;
      if (exists) {
        result.productsIds.push(item.productId);
      } else {
        result = new Type(item.id, item.name, [item.productId]);
      }
    }
    return result;
  }

  async create(object) {
    const connection = await this.getConnection();

    const sql = `insert into types (name) values (?)`;
    const [result] = await connection.query(sql, [object.name]);
    return result;
  }

  async delete(id) {
    const connection = await this.getConnection();

    const sql = `delete from types where id = ?`;
    const [result] = await connection.query(sql, [id]);
    return result;
  }

  async update(object) {
    const connection = await this.getConnection();

    const sql = `update types set name = ? where id = ?`;
    const [result] = await connection.query(sql, [object.name, object.id]);
    return result;
  }
}

module.exports = new TypeRepository();
