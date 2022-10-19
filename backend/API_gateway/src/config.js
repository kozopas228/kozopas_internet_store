const config = {
    jwtSecret: "super_fuck",
    applicationPort: 5002,
    storeUrl: 'http://store_api:5003',
    authorizationUrl: 'http://authorization_api:5004',
    cdnUrl: 'http://host.docker.internal:5005',
}

module.exports = config;