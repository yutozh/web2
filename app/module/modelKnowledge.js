var mongoose = require('mongoose')

var knowledgeSchema = mongoose.Schema({
  url: {
    type: String,
    unique: true
  },
  title: String,
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
  like: {
    type: Number,
    default: 0
  },
  body: String,
  author: String,
  desc: String,
  tags: [String],
  hide: {
    type: Boolean,
    default: false
  }
})

mongoose.model('knowledge', knowledgeSchema)
