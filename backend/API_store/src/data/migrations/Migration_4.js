const BaseMigration = require("./BaseMigration");

class Migration_4 extends BaseMigration {
    constructor(connection) {
        super(connection);

    }
    async apply() {
        try {
            await this._connection.query('select quantity from products_orders');
        } catch (e) {
            if(e.message == `Unknown column 'quantity' in 'field list'`) {
                let sql = `alter table products_orders
                    add quantity int not null`;

                await this._connection.query(sql);
            }
        }
    }
}

module.exports = Migration_4;