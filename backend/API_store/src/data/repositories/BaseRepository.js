const dbContext = require('../dbContext');
class BaseRepository {
    async getConnection() {
        if(!this._connection) {
            this._connection = await dbContext.getConnection();
        }
        return this._connection;
    }
}

module.exports = BaseRepository;