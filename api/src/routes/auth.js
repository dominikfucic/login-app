const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

function authenticate(username, password, cb) {
    db.get('SELECT rowid AS id, * FROM users WHERE username = ?', [username], function (err, row) {
        if (err) {
            return cb(err);
        }
        if (!row) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) {
                return cb(err);
            }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}


router.post('/login', function (req, res, next) {
    authenticate(req.body.username, req.body.password, function (err, user, message) {
        if (err) return next(err);
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user
                res.send(user.username)
            })

        } else {
            res.send(message)
        }
    });
})

router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.send('Logged out')
});

router.post('/register', function (req, res, next) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) { return next(err); }
        db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
            req.body.username,
            hashedPassword,
            salt
        ], function (err) {
            if (err) { return next(err); } //next(err)
            req.session.regenerate(function () {
                res.send(req.body.username)
            });
        });
    });
});

module.exports = router;