const BaseMigration = require("./BaseMigration");
const bcrypt = require('bcrypt');

class MigrationInitializeData extends BaseMigration {
  constructor(connection) {
    super(connection);
  }
    _users = [
      [1, 'kozopas', 'kozopas@mail.com', bcrypt.hashSync('test', 5)],
      [2, 'andrii', 'andrii@mail.com', bcrypt.hashSync('adasd', 5)],
      [3, 'patau', 'patau@mail.com', bcrypt.hashSync('some_password', 5)],
      [4, 'admin', 'admin@mail.com', bcrypt.hashSync('admin', 5)],
    ];

    _roles = [
      [1, 'user'],
      [2, 'admin'],
    ];

    _usersRoles = [
      [1, 1, 1],
      [2, 2, 1],
      [3, 3, 1],
      [4, 4, 1],
      [5, 4, 2],
    ];

  async apply() {
    await this.initializeUsers();
    await this.initializeRoles();
    await this.initializeUsersRoles();
  }

  async initializeUsers() {
    const values = await this._connection.query('select * from users');

    if (values[0].length) {
      return;
    }

    let sql = `insert into users (id, username, email, password) values ?`;

    await this._connection.query(sql, [this._users]);
  }

  async initializeRoles() {
    const values = await this._connection.query('select * from roles');

    if (values[0].length) {
      return;
    }

    let sql = `insert into roles (id, name) values ?`;

    await this._connection.query(sql, [this._roles]);
  }

  async initializeUsersRoles() {
    const values = await this._connection.query('select * from users_roles');

    if (values[0].length) {
      return;
    }

    let sql = `insert into users_roles (id, userId, roleId) values ?`;

    await this._connection.query(sql, [this._usersRoles]);
  }
}

module.exports = MigrationInitializeData;