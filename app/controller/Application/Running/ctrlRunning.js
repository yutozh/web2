var mongoose = require('mongoose')
var modelRunning = mongoose.model('running')
var moment = require('moment')
var config = require('../../../../configure')
module.exports = {
  getRunningDatas: function (req, res, next) {
    var start = req.query.startDate
    var end = req.query.endDate
    
    if (!start || !end || moment(end).isBefore(start)) {
      return res.send({status: -1, msg: '日期范围有误，请重试'})
    }
    
    modelRunning.find({'datetime': {'$gte': new Date(start), '$lte': new Date(end)}})
      .sort({'datetime': 1})
      .exec(function (err, docs) {
        if (err) {
          return res.send({status: -2, msg: err.msg})
        }
        return res.send({status: 0, content: docs})
      })
  },
  getRunningDatasAdmin: function (req, res, next) {
    var page = parseInt(req.query.page)
    page = isNaN(page) ? 1 : page
    
    modelRunning.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      allItems = docs
      // find the items by page and keywords
      modelRunning
        .find({})  // re
        .sort({'datetime': -1})
        .skip(config.adminPageSize * (page - 1))
        .limit(config.adminPageSize)
        .exec(function (err, docs) {
          if (err) return next(err)
          res.send({status: 0, content: docs, allItems: allItems})
        })
    })
    
  },
  postRunningDatas: function (req, res, next) {
    var datetime = req.body.datetime
    var weight = req.body.weight
    var fat = req.body.fat
    var runLen = req.body.runLen
    var walkLen = req.body.walkLen
    var food = req.body.food
    var user = req.session.adminUser
    var updateTime = Date.now()
    
    datetime = new Date(datetime)
    if (isFormatDate(datetime)) {
      var item = {
        datetime: datetime,
        weight: weight,
        fat: fat,
        runLen: runLen,
        walkLen: walkLen,
        food: food,
        user: user,
        updateTime: updateTime
      }
      modelRunning.update({datetime: datetime}, {$set: item}, {upsert: true}).exec(function (err) {
        if (err) {
          res.send({status: -1, msg: err.message})
        }
        res.send({status: 0})
      })
    } else {
      res.send({status: -1, msg: '格式错误'})
    }
    
    
  },
  
  postDeleteRunningDatas: function (req, res, next) {
    var datetime = req.body.datetime
    if (isFormatDate(datetime)) {
      modelRunning.remove({datetime: datetime}, function (err) {
        if (err) {
          res.send({status: -1, msg: err.message})
        }
        res.send({status: 0})
      })
    } else {
      res.send({status: -1, msg: '格式错误'})
    }
  }
}

function isFormatDate (date) {
  date = moment(date).format('YYYY-MM-DD')
  var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  var regExp = new RegExp(reg)
  return regExp.test(date)
}
