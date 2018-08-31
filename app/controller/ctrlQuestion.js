let mongoose = require('mongoose')
let modelQuestion = mongoose.model('question')
let config = require('../../configure')

module.exports = {
  getQuestion: function (req, res, next) {
    let page = parseInt(req.query.page)
    let keyword = req.query.keyword || ''
    page = isNaN(page) ? 1 : page
    // get number of all items
    modelQuestion.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      let allItems = docs
      // find the items by page and keywords
      modelQuestion
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
  getQuestionContent: function (req, res, next) {
    let url = req.query.path
    modelQuestion
      .findOneAndUpdate({url: url}, {$inc: {view: 1},}, {fields: {'__v': 0, 'hide': 0}}, function (err, docs) {
        if (err) next(err)
        res.send({status: 0, content: docs})
      })
  },
  postQuestionVote: function (req, res, next) {
    let url = req.body.path
    let pc = parseInt(req.body.pc)
    let modify = {}
    if (pc === 1) {
      modify = {'pros': 1}
    } else if (pc === 2) {
      modify = {'cons': 1}
    } else {
      res.send({status: -2, msg: 'PC Error'})
      return
    }
    modelQuestion
      .findOneAndUpdate({url: url}, {$inc: modify}, function (err, docs) {
        if (err) next(err)
        res.send({status: 0})
      })
  }
}
