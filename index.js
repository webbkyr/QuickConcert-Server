'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const data = require('./dummydata');
const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const fetch = require('node-fetch');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// app.get('/api/concert', (req, res) => {
//     // req.params == location
//   fetch('ticketmaster....').then(res => res.json()).then(//dosomething else)
// });
//clicks

app.get('/api/concerts', (req, res) => {
  fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=taylorswift&apikey=${process.env.TKM_KEY}`)
    .then(res => {
      console.log(res);
      return res.json(data);
    })
    .then(concerts => res.json(concerts)); 
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
