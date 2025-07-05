require('dotenv').config();
const tp = require("tedious-promises");

const config = {
    userName: process.env.DBS_USERNAME,
    password: process.env.DBS_Pass,
    server: process.env.DBS_Server,
    options: 
    {
    database: process.env.DBS_DataBase,
    encrypt: true
    }
};

tp.setConnectionConfig(config);

module.exports = tp;