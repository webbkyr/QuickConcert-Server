'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EventSchema = new mongoose.Schema({
  eventName: {type: String, required: true},
  creator: {type: String},
  // eventDate: {type: Date, required: true},
  attendees: [{
    attendee: {type: String, required: true}
  }]
});

EventSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    eventName: this.eventName,
    creator: this.creator,
    // eventDate: this.eventDate,
    attendees: this.attendees
  };
};

let Event = mongoose.model('Event', EventSchema);

module.exports = { Event };