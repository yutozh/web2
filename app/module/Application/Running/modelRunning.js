var mongoose = require('mongoose')

var runningSchema = mongoose.Schema({
  datetime: Date,
  weight: Number,
  fat: Number,
  runLen: Number,
  walkLen: Number,
  food: Number,
  user: String,
  updateTime: Date
})

mongoose.model('running', runningSchema)
