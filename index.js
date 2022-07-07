require('./model/database');
const path = require('path');
const express = require('express');
require('dotenv').config();


const app = express();
const route = require('./route/route');
const morgan = require('morgan');
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(morgan('tiny'));
app.use('/', route);







app.listen(port, console.log(`you are logged in with port ${port}`));