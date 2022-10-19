class BaseMigration {
  _connection;
  constructor(connection) {
    this._connection = connection;
  }
}

module.exports = BaseMigration;
