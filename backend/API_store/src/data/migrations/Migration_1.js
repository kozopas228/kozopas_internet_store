const BaseMigration = require("./BaseMigration");

class Migration_1 extends BaseMigration {
  constructor(connection) {
    super(connection);
  }

  async apply() {
    const [tables] = await this._connection.query("show tables");
    if (tables.length) {
      return;
    }

    let sql = `
      create table if not exists baskets (
        id int primary key auto_increment,
        userId int,
        foreign key (userId) references kozopas_internet_store_authorization.users(id) on delete cascade
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists orders (
        id int primary key auto_increment,
        creationDate datetime not null default now(),
        status varchar(45) not null,
        basketId int not null,
        foreign key (basketId) references baskets(id) on delete cascade
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists products_orders (
        id int primary key auto_increment,
        productId int not null,
        orderId int not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists products (
        id int primary key auto_increment,
        name varchar(45) not null,
        price int not null default 0,
        quantity int not null default 0,
        image varchar(45),
        brandId int not null,
        typeId int not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      alter table products_orders 
      add constraint productid_fk foreign key (productId) references products(id) on delete cascade,
      add constraint orderid_fk foreign key (orderId) references orders(id) on delete cascade;
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists products_colors (
        id int primary key auto_increment,
        productId int not null,
        colorId int not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists colors (
        id int primary key auto_increment,
        name varchar(45) not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists types (
        id int primary key auto_increment,
        name varchar(45) not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      create table if not exists brands (
        id int primary key auto_increment,
        name varchar(45) not null
      );
      `;
    await this._connection.query(sql);

    sql = `
      alter table products 
      add constraint brandid_fk foreign key (brandId) references brands(id) on delete cascade,
      add constraint typeid_fk foreign key (typeId) references types(id) on delete cascade;
    `;
    await this._connection.query(sql);

    sql = `
      create table if not exists productspecs (
        id int primary key auto_increment,
        title varchar(45) not null,
        description varchar(450) not null,
        productId int not null,
        constraint productid_fk_2 foreign key (productId) references products(id) on delete cascade
      );
      `;
    await this._connection.query(sql);
  }
}

module.exports = Migration_1;
