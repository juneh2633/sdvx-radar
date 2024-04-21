const { Pool } = require("pg");
const pgConfig = require("../config/pgConfig");

module.exports = new Pool(pgConfig);
