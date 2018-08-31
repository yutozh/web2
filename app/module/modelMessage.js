var mongoose = require('mongoose')

var messageSchema = mongoose.Schema({
  body: String,
  author: String,
  date: {
    type: String,
    default: Date.now()
  },
  view: {
    type: Number,
    default: 0
  },
  hide: {
    type: Boolean,
    default: false
  }
})

mongoose.model('message', messageSchema)
