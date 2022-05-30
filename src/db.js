const JSONdb = require('simple-json-db');
const path = require('path');
const db = new JSONdb(path.join(__dirname, "../db.json"));

function getDB() {
  return db;
}

module.exports = {
  getDB
};
