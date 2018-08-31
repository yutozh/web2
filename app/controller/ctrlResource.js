let mongoose = require('mongoose')
let modelResource = mongoose.model('resource')
let config = require('../../configure')

module.exports = {
  getResource: function (req, res, next) {
    let page = parseInt(req.query.page)
    let keyword = req.query.keyword || ''
    let type = parseInt(req.query.type)
    page = isNaN(page) ? 1 : page
    type = (isNaN(type) || type === 0) ? '' : config.resourceTypeList[type]
    // get number of all items
    modelResource.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      let allItems = docs
      // find the items by page and keywords
      modelResource
        .find({hide: false, name: {$regex: keyword}, type: {$regex: type}}, {password: 0, '__v': 0, 'hide': 0}) // re
        .skip(config.pageSize * (page - 1))
        .sort({'_id': -1})
        .limit(config.pageSize)
        .exec(function (err, docs) {
          if (err) return next(err)
          res.send({status: 0, content: docs, allItems: allItems})
        })
    })
  },
  getResourceContent: function (req, res, next) {
    let url = req.query.path
    modelResource
      .findOneAndUpdate({url: url}, {$inc: {view: 1}}, {
        fields: {
          password: 0,
          '__v': 0,
          'hide': 0
        }
      }, function (err, docs) {
        if (err) next(err)
        res.send({status: 0, content: docs})
      })
  }
}
