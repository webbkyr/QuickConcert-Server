'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ajax = require('ajax-request');


const { DATABASE, PORT } = require('../config');

// //getConcertDates() {
//   //get today's date
//   const todaysDate = new Date();
//   //remove extra seconds from the ISO date format
//   const startDateTime = todaysDate.toISOString().slice(0,19)+'Z';
//   //get tomorrow's date in seconds
//   const tomorrowSeconds = todaysDate.setDate(todaysDate.getDate()+1);
//   //convert tomorrow's seconds into a new Date object
//   const tomorrowsDate = new Date(tomorrowSeconds);
//   //convert tomorrow's date to an ISO string with extra seconds removed
//   const endDateTime = tomorrowsDate.toISOString().slice(0,19)+'Z';
  
//   return {startDateTime, endDateTime};

// }

/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {
  //use req.query
  console.log(req.query)
  console.log(req.query.city)
  const todaysDate = new Date();
  const startDateTime = todaysDate.toISOString().slice(0, 19)+'Z';
  const tomorrow = new Date(todaysDate.setDate(todaysDate.getDate()+2));
  const endDateTime = tomorrow.toISOString().slice(0,11)+'00:00:00Z';

  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&classificationName=music&city=${req.query.city}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&apikey=${process.env.TKM_KEY}`)
    .then(res => {
      return res.json(res);
    })
    .then(concerts => {
      res.json(concerts._embedded.events);
    }); 
});

module.exports = router;