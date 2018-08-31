var mongoose = require('mongoose')
var config = require('./configure')

module.exports = function () {
  var db = mongoose.connect(config.mongoString, {
    useMongoClient: true
  })
  require('./app/module/modelKnowledge')
  require('./app/module/modelQuestion')
  require('./app/module/modelResource')
  require('./app/module/modelMessage')
  require('./app/module/Application/Running/modelRunning')
  return db
  
}
