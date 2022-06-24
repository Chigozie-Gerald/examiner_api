var mongoose = require('mongoose');
const Question = require('./question');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  name: { type: String, trim: true, unique: true },
  imageAddress: { type: String, trim: true },
});

module.exports = mongoose.model('Tag', tagSchema);
