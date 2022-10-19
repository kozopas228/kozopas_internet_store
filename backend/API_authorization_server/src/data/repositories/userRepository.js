const BaseRepository = require("./BaseRepository");
const dbContext = require("../dbContext");
const User = require('../../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(dbContext.getConnection());
  }

  // returns created object
  async create(object) {
    const sql = `insert into users (username, email, password) values (?, ?, ?)`;
    const sqlResult = (await super.commit(sql, [object.username, object.email, object.password]))[0];
    for (const roleId of object.rolesIds) {
      await super.commit(`insert into users_roles (userId, roleId) values(?, ?)`, [sqlResult.insertId, roleId]);
    }

    return await this.getById(sqlResult.insertId);
  }

  async getById(id) {
    const sql = `select users.id, users.username, users.email, users.password, users_roles.roleId from users
    left outer join users_roles on users.id = users_roles.userId
    where users.id = ?`;
    const sqlResults = (await super.commit(sql, id))[0];

    const result = this._createUser(sqlResults);
    return result;
  }

  async getByEmail(email) {
    const sql = `select users.id, users.username, users.email, users.password, users_roles.roleId from users
    left outer join users_roles on users.id = users_roles.userId
    where users.email = ?`;
    const sqlResults = (await super.commit(sql, email))[0];

    const result = this._createUser(sqlResults);
    return result;
  }

  async getByUsername(username) {
    const sql = `select users.id, users.username, users.email, users.password, users_roles.roleId from users
    left outer join users_roles on users.id = users_roles.userId
    where users.username = ?`;
    const sqlResults = (await super.commit(sql, username))[0];

    const result = this._createUser(sqlResults);
    return result;
  }

  async update(object) {
    const sql = `update users set username = ?, email = ?, password = ? where id = ?`;
    const sqlResult = (await super.commit(sql, [object.username, object.email, object.password, object.id]))[0];

    await super.commit(`delete from users_roles where userId = (?)`, object.id);
    for (const roleId of object.rolesIds) {
      await super.commit(`insert into users_roles (userId, roleId) values(?, ?)`, [object.id, roleId]);
    }
    return await this.getById(object.id);
  }

  // creates new user from sql result and assigns roles to it
  _createUser(sqlResults) {
    if (sqlResults.length == 0) {
      return undefined;
    }

    const user = sqlResults[0];

    let result = new User(user.username, user.email, user.password, []);
    result.id = user.id;

    for (const item of sqlResults) {
      result.rolesIds.push(item.roleId);
    }

    return result;
  }
}

module.exports = new UserRepository();
