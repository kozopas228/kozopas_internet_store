const BaseRepository = require('./BaseRepository');
const ProductQuantity = require('../../models/ProductQuantity');

class ProductQuantityRepository extends BaseRepository{
    async getAllByBasketId(basketId) {
        const sql = `
            select id, productId, quantity, basketId from products_quantities 
            where basketId = ?`;

        const connection = await this.getConnection();
        const [sqlResults] = await connection.query(sql, [basketId]);

        if(sqlResults.length == 0) {
            return undefined;
        }

        const result = [];

        for(let pq of sqlResults) {
            result.push(new ProductQuantity(pq.id, basketId, pq.productId, pq.quantity));
        }
        return result;
    }

    async addProduct(basketId, productId) {
        const sql = `
            insert into products_quantities (productId, quantity, basketId)
            values (?)`;

        const connection = await this.getConnection();
        const [sqlResult] = await connection.query(sql, [[productId, 1, basketId]]);

        return sqlResult;
    }

    async removeProduct(basketId, productId) {
        const sql = `
            delete from products_quantities 
            where basketId = (?) and productId = (?)`;

        const connection = await this.getConnection();
        const [sqlResult] = await connection.query(sql, [basketId, productId]);

        return sqlResult;
    }

    async changeProductQuantity(basketId, productId, quantity) {
        const sql = `
            update products_quantities
            set quantity = (?) 
            where basketId = (?) and productId = (?)`;

        const connection = await this.getConnection();
        const [sqlResult] = await connection.query(sql, [quantity, basketId, productId]);

        return sqlResult;
    }


}

module.exports = new ProductQuantityRepository();
