const BaseRepository = require('./BaseRepository');
const Product = require('../../models/Product');

class ProductRepository extends BaseRepository {

  async getAll() {
    const sql = `
      select products.id, products.name, products.price, products.quantity, products.image, products.brandId, products.typeId, products_colors.colorId from products 
      left outer join products_colors on products.id = products_colors.productId
      order by name;`;

    const connection = await this.getConnection();
    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id === item.id);
      if (found) {
        found.colorsIds.push(item.colorId);
      } else {
        result.push(new Product(item.id, item.name, item.price, item.quantity, item.image, item.brandId, item.typeId, [item.colorId]));
      }
    }
    return result;
  }

  async getAllByOffsetWithLimit(offset, limit, orderBy, order) {
    const connection = await this.getConnection();

    const ids = (await connection.query(`select id from products order by ${orderBy} ${order} limit ?, ? ;`, [offset, limit]))[0];

    if(ids.length === 0) {
      return [];
    }

    let sql = `
      select products.id, products.name, products.price, products.quantity, products.image, products.brandId, products.typeId, products_colors.colorId from products 
      left outer join products_colors on products.id = products_colors.productId
      where `;


    for (const id of ids) {
      sql += `products.id = ${id.id} or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += `
      order by ${orderBy} ${order};`

    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.colorsIds.push(item.colorId);
      } else {
        result.push(new Product(item.id, item.name, item.price, item.quantity, item.image, item.brandId, item.typeId, [item.colorId]));
      }
    }
    return result;
  }

  async getAllByOffsetWithLimitAndFiltration(offset, limit, filter, orderBy, order) {
    const connection = await this.getConnection();

    const [ids] = (await connection.query(`select id from products ${filter} order by ${orderBy} ${order} limit ?, ?;`, [offset, limit]));

    if(ids.length == 0) {
      return [];
    }

    let sql = `
      select products.id, products.name, products.price, products.quantity, products.image, products.brandId, products.typeId, products_colors.colorId from products 
      left outer join products_colors on products.id = products_colors.productId
      where `;

    for (const id of ids) {
      sql += `products.id = ${id.id} or `;
    }
    sql = sql.slice(0, sql.length - 4);
    sql += `
      order by ${orderBy} ${order};`

    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.colorsIds.push(item.colorId);
      } else {
        result.push(new Product(item.id, item.name, item.price, item.quantity, item.image, item.brandId, item.typeId, [item.colorId]));
      }
    }
    return result;
  }

  // you should pass sql string, result of which must be list of products' ids
  async getAllByOffsetWithRawSql(rawString, params) {
    const connection = await this.getConnection();

    const ids = (await connection.query(rawString, params))[0];

    if(ids.length == 0) {
      return [];
    }

    let sql = `
      select products.id, products.name, products.price, products.quantity, products.image, products.brandId, products.typeId, products_colors.colorId from products 
      left outer join products_colors on products.id = products_colors.productId
      where `;

    for (const id of ids) {
      sql += `products.id = ${id.id} or `;
    }
    sql = sql.slice(0, sql.length - 4) + ';';

    const [sqlResults] = await connection.query(sql);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        found.colorsIds.push(item.colorId);
      } else {
        result.push(new Product(item.id, item.name, item.price, item.quantity, item.image, item.brandId, item.typeId, [item.colorId]));
      }
    }
    return result;
  }

  async getById(id) {
    const connection = await this.getConnection();

    const sql = `
    select products.id, products.name, products.price, products.quantity, products.image, products.brandId, products.typeId, products_colors.colorId, productspecs.id as productSpecId from products 
    left outer join products_colors on products.id = products_colors.productId
    left outer join productspecs on products.id = productspecs.productId 
    where products.id = ?
    `;
    const [sqlResults] = await connection.query(sql, id);

    const result = [];
    for (const item of sqlResults) {
      let found = result.find(x => x.id == item.id);
      if (found) {
        if (!(found.colorsIds.find(x => x == item.colorId))) {
          found.colorsIds.push(item.colorId);
        }
        if (!(found.productSpecsIds.find(x => x == item.productSpecId))) {
          found.productSpecsIds.push(item.productSpecId);
        }
      } else {
        result.push(new Product(item.id, item.name, item.price, item.quantity, item.image, item.brandId, item.typeId, [item.colorId], [item.productSpecId]));
      }
    }
    return result[0];
  }

  async create(object) {
    const connection = await this.getConnection();

    const sql = `insert into products (name, price, quantity, image, brandId, typeId) values (?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [object.name, object.price, object.quantity, object.image, object.brandId, object.typeId]);

    for (const colorId of object.colorsIds) {
      await connection.query(`insert into products_colors(productId, colorId) values (?)`, [[result.insertId, colorId]]);
    }

    return result;
  }

  async delete(id) {
    const connection = await this.getConnection();

    const sql = `delete from products where id = (?)`;
    const [result] = await connection.query(sql, id);
    return result;
  }

  async update(object) {
    const connection = await this.getConnection();

    const sql = `update products set name = ?, price = ?, quantity = ?, image = ?, brandId = ?, typeId = ? where id = ?`;
    const [result] = await connection.query(sql, [object.name, object.price, object.quantity, object.image, object.brandId, object.typeId, object.id]);
    return result;
  }
}

module.exports = new ProductRepository();