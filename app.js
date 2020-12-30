const express = require('express');
const morgan = require('morgan');
const users = require('./routes/users');
const auth = require('./routes/auth');
const watchlist = require('./routes/watchlist');
const movies = require('./routes/movies');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', users);
app.use('/auth', auth);
app.use('/watchlist', watchlist);
app.use('/movies', movies);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});