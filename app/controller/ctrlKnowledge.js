let mongoose = require('mongoose')
let modelKnowledge = mongoose.model('knowledge')
let config = require('../../configure')

module.exports = {
  getKnowledge: function (req, res, next) {
    let page = parseInt(req.query.page)
    let keyword = req.query.keyword || ''
    page = isNaN(page) ? 1 : page
    // get number of all items
    modelKnowledge.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      let allItems = docs
      // find the items by page and keywords
      modelKnowledge
        .find({hide: false, title: {$regex: keyword}}, {'__v': 0, 'hide': 0}) // re
        .sort({'_id': -1})
        .skip(config.pageSize * (page - 1))
        .limit(config.pageSize)
        .exec(function (err, docs) {
          if (err) return next(err)
          res.send({status: 0, content: docs, allItems: allItems})
        })
    })
  },
  getKnowledgeContent: function (req, res, next) {
    let url = req.query.path
    modelKnowledge
      .findOneAndUpdate({url: url}, {$inc: {view: 1}}, {fields: {'__v': 0, 'hide': 0}}, function (err, docs) {
        if (err) next(err)
        res.send({status: 0, content: docs})
      })
  },
  postKnowledgeLike: function (req, res, next) {
    let url = req.body.path
    modelKnowledge.findOneAndUpdate({url: url}, {$inc: {like: 1}}, function (err) {
      if (err) next(err)
      res.send({status: 0})
    })
  }
}
