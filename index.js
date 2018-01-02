'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const data = require('./dummydata');
const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const fetch = require('node-fetch');
//require body parser/json

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
  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&classificationName=music&city=chicago&startDateTime=2018-01-02T11:39:00Z&endDateTime=2018-01-03T11:39:00Z&apikey=${process.env.TKM_KEY}`)
    .then(res => {
      return res.json(data);
    })
<<<<<<< HEAD
    .then(concerts => {
      res.json(concerts._embedded.events);
    }); 
=======
    .then(concerts => res.json(concerts._embedded.attractions)); 
>>>>>>> cad6c4b4dd5b176a93c9130e83a9a56ef697aa8a
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
