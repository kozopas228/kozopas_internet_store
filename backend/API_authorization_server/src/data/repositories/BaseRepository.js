class BaseRepository {
  constructor(promiseConnection) {
    promiseConnection.then((result) => {
      this._connection = result;
    });
  }

  async commit(sql, params) {
    const result = await this._connection.query(sql, params);
    return result;
  }

  async closeConnection() {
    await this._connection.end();
  }
}

module.exports = BaseRepository;
