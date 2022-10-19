const BaseRepository = require('./BaseRepository');
const Brand = require('../../models/Brand');

class BrandRepository extends BaseRepository {

  async getAll() {
    const sql = `
      select brands.id, brands.name, products.id as productId from brands 
      inner join products on brands.id = products.brandId
      `;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql);

    const result = [];
    for (const item of sqlResult) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.productsIds.push(item.productId);
      } else {
        result.push(new Brand(item.id, item.name, [item.productId]));
      }
    }
    return result;
  }

  async getById(id) {
    const sql = `
      select brands.id, brands.name, products.id as productId from brands  
      inner join products on brands.id = products.brandId
      where brands.id = ?
      `;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);

    let result;
    for (const item of sqlResult) {
      let exists = result?.id == item.id;
      if (exists) {
        result.productsIds.push(item.productId);
      } else {
        result = new Brand(item.id, item.name, [item.productId]);
      }
    }
    return result;
  }

  async create(object) {
    const sql = `insert into brands (name) values (?)`;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, object.name);
    return sqlResult;
  }

  async delete(id) {
    const sql = `delete from brands where id = ?`;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [id]);
    return sqlResult;
  }

  async update(object) {
    const sql = `update brands set name = ? where id = ?`;
    const connection = await this.getConnection();
    const [sqlResult] = await connection.query(sql, [object.name, object.id]);
    return sqlResult;
  }
}

module.exports = new BrandRepository();