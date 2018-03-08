'use strict';
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { Event } = require('../db/models');

/* ======GET/READ REQUESTS ======= */

router.get('/concerts', (req, res) => {

  const todaysDate = new Date();
  const startDateTime = todaysDate.toISOString().slice(0, 19)+'Z';
  const tomorrow = new Date(todaysDate.setDate(todaysDate.getDate()+2));
  const endDateTime = tomorrow.toISOString().slice(0,11)+'01:00:00Z';

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
    .catch(() => {
      res.status(500).json({error: 'Something went wrong with our server.'});
    });
});

router.post('/concerts', (req, res) => {
  console.log('REQUEST BODY >>>>>', req.body);
  const requiredFields = ['eventName', 'creator'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      return res.status(400).send(message);
    }
  }

  Event
    .create({
      eventName: req.body.eventName,
      creator: req.body.creator,
      eventDetails: [{
        concertDate: req.body.eventDetails[0].concertDate,
        concertTime: req.body.eventDetails[0].concertTime,
        concertURL: req.body.eventDetails[0].concertURL
      }],
      attendees: [{
        attendee: req.body.attendee
      }]
    })
    .then(event => {
      res.status(201).json(event.apiRepr());
    })
    .catch((err) => {
      console.log(err)
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
    .catch(() => {
      res.status(500).json({message: 'Something went wrong with our server'});
    });
});

router.delete('/concerts/:id', (req, res) => {
  Event
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({message: 'success'});
    })
    .catch(() => {
      res.status(500).json({error: 'Something went wrong with our server.'});
    });
});

router.delete('/concerts/:id1/attendee/:id2', (req, res) => {
  Event.update(
    { _id: req.params.id1 },
    { $pull: { 'attendees': { _id: req.params.id2 } } }
  )
    .then(() => {
      res.status(204).end();
    });
});
module.exports = router;