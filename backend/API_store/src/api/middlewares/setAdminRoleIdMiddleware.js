const roles = require('../../consts/roles');
const dbContext = require('../../data/dbContext');

async function setAdminRoleIdMiddleware(req, res, next) {
    const connection = await dbContext.getConnection();
    const [role] = await connection.query('select id from kozopas_internet_store_authorization.roles where name = (?)', [roles.ADMIN]);
    req.accessedRoles = [role[0].id];
    next();
}

module.exports = setAdminRoleIdMiddleware;