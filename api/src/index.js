const express = require('express');
const authRouter = require('./routes/auth');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const app = express();

const PORT = 3001;

app.use(morgan('combined'));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));

app.use('/', authRouter);

app.get('/api', (req, res) => res.send(req.user));

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('/*', function(req,res) {
		res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.send(err);
});

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`));