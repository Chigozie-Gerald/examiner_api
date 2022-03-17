var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var questionSchema = new Schema({
  tag: { type: ObjectId, ref: 'Tag', required: true },
  title: { type: String, trim: true, required: true },
  count: { type: Number, default: 0 },
  details: { type: String, trim: true, required: true },
  imageAddress: { type: String, trim: true },
  image: {
    data: { type: Buffer },
    contentType: { type: String },
  },
});

module.exports = mongoose.model('Question', questionSchema);
