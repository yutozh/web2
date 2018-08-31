var mongoose = require('mongoose')

var questionSchema = mongoose.Schema({
  title: String,
  url: {
    type: String,
    unique: true
  },
  date: {
    type: String,
    default: Date.now()
  },
  upDate: {
    type: String
  },
  view: {
    type: Number,
    default: 0
  },
  pros: {
    type: Number,
    default: 0
  },
  cons: {
    type: Number,
    default: 0
  },
  body: String,
  author: String,
  tags: [String],
  hide: {
    type: Boolean,
    default: false
  }
})

mongoose.model('question', questionSchema)
