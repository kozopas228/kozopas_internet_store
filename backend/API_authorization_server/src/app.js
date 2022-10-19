const express = require('express');
const routes = require('./api/routes');
const cors = require('cors');
const errorMiddleware = require('./api/middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

module.exports = app;