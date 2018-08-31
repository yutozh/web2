var mongoose = require('mongoose')
var modelKnowledge = mongoose.model('knowledge')
var modelQuestion = mongoose.model('question')
var config = require('../../configure')

module.exports = {
  getTags: function (req, res, next) {
    var page = parseInt(req.query.page)
    var column = req.query.column
    var tag = req.query.tag
    
    page = isNaN(page) ? 1 : page
    
    if (column === 'knowledge') {
      modelKnowledge.find({}).count().exec(function (err, docs) {
        if (err) return next(err)
        allItems = docs
        // find the items by page and tag
        modelKnowledge
          .find({hide: false, tags: tag}, {'__v': 0, 'hide': 0})  // re
          .sort({'_id': -1})
          .skip(config.pageSize * (page - 1))
          .limit(config.pageSize)
          .exec(function (err, docs) {
            if (err) return next(err)
            res.send({status: 0, content: docs, allItems: allItems})
          })
      })
    } else if (column === 'question') {
      modelQuestion.find({}).count().exec(function (err, docs) {
        if (err) return next(err)
        allItems = docs
        // find the items by page and tag
        modelQuestion
          .find({hide: false, tags: tag}, {'__v': 0, 'hide': 0})  // re
          .sort({'_id': -1})
          .skip(config.pageSize * (page - 1))
          .limit(config.pageSize)
          .exec(function (err, docs) {
            if (err) return next(err)
            res.send({status: 0, content: docs, allItems: allItems})
          })
      })
    } else {
      res.send({status: -2, msg: 'Column Error'})
    }
  }
}

