const BaseMigration = require('./BaseMigration');

class Migration_5 extends BaseMigration{
    constructor(connection) {
        super(connection);
    }

    async apply() {
        try {
            await this._connection.query('alter table baskets add constraint unique_userId_baskets unique(userId)');
        } catch (e) {

        }
    }
}

module.exports = Migration_5;