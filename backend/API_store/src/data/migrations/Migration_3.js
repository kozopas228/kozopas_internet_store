const BaseMigration = require("./BaseMigration");

class Migration_3 extends BaseMigration {
    constructor(connection) {
        super(connection);

        this._productsQuantities = [
            [1, 1, 3, 1],
            [2, 2, 1, 1],
            [3, 3, 2, 1],
        ];
    }

    async apply() {
        let sql = `create table if not exists products_quantities (
        id int primary key auto_increment,
        productId int not null,
        quantity int not null,
        basketId int not null,
        foreign key(basketId) references baskets(id) on delete cascade)`;

        await this._connection.query(sql);

        const values = await this._connection.query('select * from products_quantities');

        if (values[0].length) {
            return;
        }

        sql = `insert into products_quantities (id, productId, quantity, basketId) values ?`;

        await this._connection.query(sql, [this._productsQuantities]);
    }
}

module.exports = Migration_3;