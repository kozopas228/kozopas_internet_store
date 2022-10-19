const ApplicationError = require("../errors/ApplicationError");
const userValidator = require("../validators/userValidator");
const User = require("../../models/User");
const roles = require("../../consts/roles");
const ValidationError = require("../errors/ValidationError");
const userRepository = require("../../data/repositories/userRepository");
const roleRepository = require("../../data/repositories/roleRepository");
const config = require("../../config");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

class UserService {

  async register(username, email, password) {
    const candidate1 = await userRepository.getByUsername(username);
    const candidate2 = await userRepository.getByEmail(email);

    if (candidate1 || candidate2) {
      throw new ApplicationError("user already exists");
    }

    const userRoleId = await this.getUserRoleIdByName(roles.USER);

    const user = new User(username, email, password, [userRoleId]);

    const validationResult = userValidator.validate(user);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    user.password = await bcrypt.hash(password, 5);

    const result = await userRepository.create(user);

    const jwt = this._generateJwt(
      result.id,
      result.username,
      result.email,
      result.rolesIds
    );
    return jwt;
  }

  async login(entryData, password) {
    let user;

    const isEmail = this._checkIsEmail(entryData);

    if (isEmail) {
      user = await userRepository.getByEmail(entryData);
    } else {
      user = await userRepository.getByUsername(entryData);
    }

    if (!user) {
      throw new ApplicationError('user was not found');
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      throw new ApplicationError('wrong password');
    }

    const token = this._generateJwt(user.id, user.username, user.email, user.rolesIds);
    return token;
  }

  async getUserRoleIdByName(roleName) {
    const userRoleId = await roleRepository.getRoleIdByName(roleName);
    return userRoleId;
  }

  async check(id, username, email, rolesIds) {
    const token = this._generateJwt(id, username, email, rolesIds);
    return token;
  }

  async changeUsername(id, username) {
    const user = await userRepository.getById(id);

    if(user === undefined) {
      throw new ApplicationError('user does not exist');
    }

    user.username = username;

    const validationResult = userValidator.validate(user);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const result = await userRepository.update(user);
    return result;
  }

  async changeEmail(id, email) {
    const user = await userRepository.getById(id);

    if(user === undefined) {
      throw new ApplicationError('user does not exist');
    }

    user.email = email;

    const validationResult = userValidator.validate(user);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const result = await userRepository.update(user);
    return result;
  }

  async changePassword(id, oldPassword, newPassword) {
    const user = await userRepository.getById(id);
    if (user == null) {
      throw new ApplicationError('user was not found');
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new ApplicationError('wrong password');
    }

    user.password = newPassword;

    const validationResult = userValidator.validate(user);
    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    user.password = await bcrypt.hash(newPassword, 5);

    const result = await userRepository.update(user);
    return result;
  }

  async changeRoles(id, rolesIds) {
    const user = await userRepository.getById(id);

    if (!user) {
      throw new ApplicationError('user was not found');
    }

    user.rolesIds = [];
    for (let roleId of rolesIds) {
      const existing = await roleRepository.getById(roleId);
      if (!existing) {
        throw new ApplicationError('user has unexisting role(s)');
      }

      user.rolesIds.push(roleId);
    }

    const result = await userRepository.update(user);
    return result;
  }

  _generateJwt(id, username, email, rolesIds) {
    const secretKey = config.jwtSecret;

    return jwt.sign({ id, username, email, rolesIds }, secretKey, {
      expiresIn: "24h",
    });
  }

  _checkIsEmail(entryData) {
    return Boolean(
        entryData
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
    );
  }
}

module.exports = new UserService();
