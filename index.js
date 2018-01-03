'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const concertsRouter = require('./routers/concerts-router');
const { Event } = require('./db/models')

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

app.use(jsonParser);

app.use('/api', concertsRouter);

// app.get('/api/concert', (req, res) => {
//     // req.params == location
//   fetch('ticketmaster....').then(res => res.json()).then(//dosomething else)
// });
//clicks

// app.get('/api/concerts', (req, res) => {
//   // const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json'), params = {p};
//   const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
//   // const getConcerts = (endpoint, query = {} ) => {
//   //   Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
//   //   return fetch(url).then(res => res.json(data)).then(concerts => console.log(concerts));

//   // };
//   fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&classificationName=music&city=chicago&startDateTime=2018-01-02T11:39:00Z&endDateTime=2018-01-03T11:39:00Z&apikey=${process.env.TKM_KEY}`)
//     .then(res => {
//       return res.json(data);
//     })
//     .then(concerts => {
//       res.json(concerts._embedded.events);
//     }); 
// });

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
