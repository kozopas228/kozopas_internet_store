const config = {
    dbName: "kozopas_internet_store",
    dbUser: "root",
    dbPassword: "P@ssw0rd",
    dbHost: "host.docker.internal",
    dbPort: 3306,
    jwtSecret: "super_fuck",
    applicationPort: 5003,
    cdnUrl: 'http://host.docker.internal:5005'
}

module.exports = config;