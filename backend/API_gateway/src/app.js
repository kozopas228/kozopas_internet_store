const express = require('express');
const routes = require('./api/routes');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/api', routes);

module.exports = app;