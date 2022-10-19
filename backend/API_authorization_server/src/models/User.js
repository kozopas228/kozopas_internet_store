class User {
    constructor(username, email, password, rolesIds) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.rolesIds = rolesIds;
    }
}

module.exports = User;