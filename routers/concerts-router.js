'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ajax = require('ajax-request');


const { DATABASE, PORT } = require('../config');


/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {

  const todaysDate = new Date();
  const startDateTime = todaysDate.toISOString().slice(0, 19)+'Z';
  const tomorrow = new Date(todaysDate.setDate(todaysDate.getDate()+2));
  const endDateTime = tomorrow.toISOString().slice(0,11)+'01:00:00Z';
  console.log(startDateTime)
  console.log(endDateTime)
  console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TKM_KEY}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&city=${req.query.city}&countryCode=US&classificationName=music`);

  // https://app.ticketmaster.com/discovery/v2/events.json?apikey=wCHbhAq3GitRal013GIynrAfLxPqmQqB&startDateTime=2018-01-03T15:58:12Z&endDateTime=2018-01-05T00:00:00Z&city=baltimore&countryCode=US&classificationName=music

  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TKM_KEY}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&city=${req.query.city}&countryCode=US&classificationName=music`)

    .then(res => {
      return res.json(res);
    })
    .then(concerts => {
      console.log(concerts)
      res.json(concerts._embedded ? concerts._embedded.events : []);
    })
    .catch(e => res.json(e)); 
});

module.exports = router;