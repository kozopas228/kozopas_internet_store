const config = require('./config');
const app = require('./app');
const dbContext = require('./data/dbContext');
const port = config.applicationPort;

start();

async function start() {
    // await dbContext.dropAllTables();
    await dbContext.applyMigrations();
    app.listen(port, () => {
        console.log(`application started on port ${port}`);
    });
}


