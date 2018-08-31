var mongoose = require('mongoose')

var resourceSchema = mongoose.Schema({
  url: {
    type: String,
    unique: true
  },
  name: String,
  desc: String,
  detail: String,
  date: {
    type: String,
    default: Date.now()
  },
  size: String,
  downloadNum: Number,
  auth: String,
  view: {
    type: Number,
    default: 0
  },
  author: String,
  type: String,
  password: String,
  hide: {
    type: Boolean,
    default: false
  }
})

mongoose.model('resource', resourceSchema)
