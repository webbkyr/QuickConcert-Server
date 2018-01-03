'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ajax = require('ajax-request');


const { DATABASE, PORT } = require('../config');

/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {
  console.log(req);
  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=atlanta&startDateTime=2018-01-03T11:39:00Z&endDateTime=2018-01-04T11:39:00Z&apikey=${process.env.TKM_KEY}`)
    .then(res => {
      return res.json(res);
    })
    .then(concerts => {
      res.json(concerts._embedded.events);
    }); 
});

module.exports = router;