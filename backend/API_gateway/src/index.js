const config = require('./config');
const app = require('./app');
const port = config.applicationPort;

start();

async function start() {
    app.listen(port, () => {
        console.log(`application started on port ${port}`);
    });
}


