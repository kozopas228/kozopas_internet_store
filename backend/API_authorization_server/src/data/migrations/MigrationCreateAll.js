const BaseMigration = require("./BaseMigration");

class MigrationCreateAll extends BaseMigration {
  constructor(connection) {
    super(connection);
  }

  async apply() {
    const tables = await this._connection.query("show tables");
    if (tables[0].length) {
      return;
    }

    let sql = `
      create table if not exists users_roles (
        id int primary key auto_increment,
        userId int not null,
        roleId int not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists roles (
        id int primary key auto_increment,
        name varchar(20) not null unique
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists users (
        id int primary key auto_increment,
        username varchar(45) not null,
        email varchar(45) not null,
        password varchar(256) not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      alter table users_roles
      add constraint userid_fk foreign key (userId) references users (id) on delete cascade,
      add constraint roleid_fk foreign key (roleId) references roles (id) on delete cascade;
      `;
    await this._connection.query(sql);
  }
}

module.exports = MigrationCreateAll;
