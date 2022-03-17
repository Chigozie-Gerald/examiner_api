var mongoose = require('mongoose');
const Question = require('./question');
var Schema = mongoose.Schema;

var tagSchema = new Schema({
  name: { type: String, trim: true, unique: true },
  questions: { type: Number, default: 0 },
});

module.exports = mongoose.model('Tag', tagSchema);
