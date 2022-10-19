const dbContext = require("../dbContext");
const BaseRepository = require("./BaseRepository");

class RoleRepository extends BaseRepository {
  constructor() {
    super(dbContext.getConnection());
  }

  async getById(id) {
    const sql = `
      select roles.id, roles.name, users_roles.userId from roles
      inner join users_roles on roles.id = users_roles.roleId
      where roles.id = (?);`;
    const sqlResults = await super.commit(sql, id);

    if(sqlResults[0].length == 0) {
      return undefined;
    }

    return sqlResults[0][0];
  }

  async getRoleIdByName(name){
    const sql = `
      select roles.id, roles.name, users_roles.userId from roles
      inner join users_roles on roles.id = users_roles.roleId
      where roles.name = (?);`;
    const sqlResults = await super.commit(sql, name);

    if(sqlResults[0].length == 0) {
      return undefined;
    }
    return sqlResults[0][0].id;
  }
}

module.exports = new RoleRepository();
