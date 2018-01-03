'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const { DATABASE, PORT } = require('../config');

/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {
  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&classificationName=music&city=chicago&startDateTime=2018-01-02T11:39:00Z&endDateTime=2018-01-03T11:39:00Z&apikey=${process.env.TKM_KEY}`)
    .then(res => {
      return res.json(res);
    })
    .then(concerts => {
      res.json(concerts._embedded.events);
    }); 
});

module.exports = router;