'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const EventSchema = new mongoose.Schema({
  eventName: {type: String, required: true},
  eventDetails: { type: Object },
  creator: {type: String},
  createDate: {type: Date, default: Date.now },
  attendees: [{
    attendee: {type: String, required: true}
  }]
});

EventSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    eventName: this.eventName,
    eventDetails: this.eventDetails,
    creator: this.creator,
    createDate: this.createDate,
    attendees: this.attendees
  };
};

let Event = mongoose.model('Event', EventSchema);

module.exports = { Event };