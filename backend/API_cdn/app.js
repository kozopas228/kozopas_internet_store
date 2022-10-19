const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.static('./data'));
app.use(fileUpload({}));
app.use(routes);

module.exports = app;