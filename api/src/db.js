const sqlite3 = require('sqlite3');
const crypto = require('crypto');
const mkdirp = require('mkdirp');

mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/users.db');

db.serialize(function () {
    db.run('CREATE TABLE IF NOT EXISTS users ( \
        username TEXT UNIQUE, \
        hashed_password BLOB, \
        salt BLOB \
      )');

    const salt = crypto.randomBytes(16);
    db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
        'admin',
        crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
        salt
    ]);
});

module.exports = db;