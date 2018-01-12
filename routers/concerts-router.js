'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Event } = require('../db/models');


const { DATABASE, PORT } = require('../config');


/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {

  const todaysDate = new Date();
  const startDateTime = todaysDate.toISOString().slice(0, 19)+'Z';
  const tomorrow = new Date(todaysDate.setDate(todaysDate.getDate()+2));
  const endDateTime = tomorrow.toISOString().slice(0,11)+'01:00:00Z';
  // console.log(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TKM_KEY}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&city=${req.query.city}&countryCode=US&classificationName=music`);


  fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TKM_KEY}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&city=${req.query.city}&countryCode=US&classificationName=music`)

    .then(res => {
      return res.json(res);
    })
    .then(concerts => {
      console.log(concerts);
      res.json(concerts._embedded ? concerts._embedded.events : []);
    })
    .catch(e => res.json(e)); 
});

router.get('/concerts/:id', (req, res) => {
  Event
    .findById(req.params.id)
    .then(event => res.json(event.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong with our server.'});
    });
});

router.post('/concerts', (req, res) => {

  const requiredFields = ['eventName', 'creator'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Event
    .create({
      eventName: req.body.eventName,
      creator: req.body.creator,
      attendees: [{
        attendee: req.body.attendee
      }]
    })
    .then(event => {
      console.log(event);
      res.status(201).json(event.apiRepr());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong with our server!'});
    });
});

router.put('/concerts/:id', (req, res) => {
  if(!(req.params.id && req.body.id === req.body.id)){
    res.status(400).json({
      error: 'Request path ID and request body ID must match'
    });
  }
  const updated = {};
  const updatableFields = ['eventName', 'creator', 'attendee'];
  updatableFields.forEach(field => {
    if(field in req.body){
      updated[field] = req.body[field];
    }
  });
  Event
    .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
    .then(updatedEvent => {
      res.status(201).json(updatedEvent);
    })
    .catch(err => {
      res.status(500).json({message: 'Something went wrong with our server'});
    });
});

router.delete('/concerts/:id', (req, res) => {
  Event
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'Something went wrong with our server.'});
    });
});

router.delete('/concerts/:id1/attendee/:id2', (req, res) => {
  Event.update(
    { _id: req.params.id1 },
    { $pull: { 'attendees': { _id: req.params.id2 } } }
  )
    .then(result => {
      res.status(204).end();
    });
});
module.exports = router;