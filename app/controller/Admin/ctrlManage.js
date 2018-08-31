var mongoose = require('mongoose')
var modelKnowledge = mongoose.model('knowledge')
var modelQuestion = mongoose.model('question')
var modelResource = mongoose.model('resource')
var modelMessage = mongoose.model('message')
var config = require('../../../configure')

var moment = require('moment')

var modelObj = {
  'modelKnowledge': modelKnowledge,
  'modelQuestion': modelQuestion,
  'modelResource': modelResource,
  'modelMessage': modelMessage
}

module.exports = {
  getLists: function (req, res, next) {
    var target = req.query.target
    target = modelObj[target]
    if (!target) {
      next()
    }
    
    var page = parseInt(req.query.page)
    page = isNaN(page) ? 1 : page
    
    // get number of all items
    target.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      allItems = docs
      // find the items by page and keywords
      target
        .find({})  // re
        .sort({'_id': -1})
        .skip(config.adminPageSize * (page - 1))
        .limit(config.adminPageSize)
        .exec(function (err, docs) {
          if (err) return next(err)
          res.send({status: 0, content: docs, allItems: allItems})
        })
    })
  },
  getContents: function (req, res, next) {
    var target = req.query.target
    target = modelObj[target]
    if (!target) {
      next()
    }
    
    var url = req.query.path
    target.findOne({url: url}, function (err, doc) {
      if (err) return next(err)
      res.send({status: 0, content: doc})
    })
  },
  
  postContents: function (req, res, next) {
    var target = req.body.target
    target = modelObj[target]
    if (!target) {
      next()
    }
    
    var update = req.body.update || false
    var content = req.body.content
    var tags = req.body.tags
    var url = req.body.path
    var title = req.body.title
    var desc = req.body.desc
    
    var item = {}
    var query = {}
    if (target === modelKnowledge && title && content && tags && url) {
      item = {
        title: title,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        author: '涛～',
        body: content,
        hide: false,
        tags: tags,
        url: url,
        desc: desc
      }
    } else if (target === modelQuestion && title && content && tags && url) {
      item = {
        title: title,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        author: '涛～',
        body: content,
        hide: false,
        tags: tags,
        url: url
      }
    } else if (target === modelMessage && content) {
      item = {
        body: content,
        author: '涛～',
        view: 0,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        hide: false
      }
    } else {
      res.send({status: -1, msg: '信息不完整或目标有误'})
      return
    }
    if (target === modelMessage) {
      query = {
        _id: url
      }
    } else {
      query = {
        url: url
      }
    }
    if (update) {
      delete item.date
      item.upDate = moment(Date.now()).format('YYYY-MM-DD HH:mm')
      target.update(query, {$set: item}, function (err) {
        if (err) {
          res.send({status: -1, msg: err.message})
        } else {
          res.send({status: 0})
        }
      })
    }
    else {
      var model
      if (target === modelKnowledge) {
        model = new modelKnowledge(item)
      } else if (target === modelQuestion) {
        model = new modelQuestion(item)
      } else if (target === modelMessage) {
        model = new modelMessage(item)
      }
      model.save(function (err) {
        if (err) {
          if (err.message.indexOf('duplicate key error') > 0) {
            res.send({status: -1, msg: 'URL已存在'})
          } else {
            res.send({status: -1, msg: err.message})
          }
        } else {
          res.send({status: 0})
        }
      })
    }
  },
  postContentsK: function (req, res, next) {
    var content = req.body.content
    var tags = req.body.tags
    var url = req.body.path
    var title = req.body.title
    var desc = req.body.desc
    
    if (title && content && tags && url) {
      var item = new modelKnowledge({
        title: title,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        author: 'happy',
        body: content,
        hide: false,
        tags: tags,
        url: url,
        desc: desc
      })
      item.save(function (err) {
        if (err) {
          if (err.message.indexOf('duplicate key error') > 0) {
            res.send({status: -1, msg: 'URL已存在'})
          } else {
            res.send({status: -1, msg: err.message})
          }
        } else {
          res.send({status: 0})
        }
      })
    } else {
      res.send({status: -2, msg: '信息不完整'})
    }
  },
  postContentsQ: function (req, res, next) {
    var content = req.body.content
    var tags = req.body.tags
    var url = req.body.path
    var title = req.body.title
    
    if (title && content && tags && url) {
      var item = new modelQuestion({
        title: title,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        author: 'happy',
        body: content,
        hide: false,
        tags: tags,
        url: url
      })
      item.save(function (err) {
        if (err) {
          if (err.message.indexOf('duplicate key error') > 0) {
            res.send({status: -1, msg: 'URL已存在'})
          } else {
            res.send({status: -1, msg: err.message})
          }
        } else {
          res.send({status: 0})
        }
      })
    } else {
      res.send({status: -2, msg: '信息不完整'})
      next()
    }
  },
  postContentsM: function (req, res, next) {
    var content = req.body.content
    
    if (content) {
      var item = new modelMessage({
        body: content,
        author: 'default',
        view: 0,
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        hide: false
      })
      item.save(function (err) {
        if (err) {
          res.send({status: -1, msg: err.message})
        } else {
          res.send({status: 0})
        }
      })
    } else {
      res.send({status: -2, msg: '信息不完整'})
      next()
    }
  },
  postChangeContents: function (req, res, next) {
    var target = req.body.target
    target = modelObj[target]
    var changeItem = req.body.changeItem
    var value = req.body.value
    var path = req.body.path
    
    var validItme = ['hide']
    if (validItme.indexOf(changeItem) < 0) {
      return res.send({status: -1, msg: 'Unsupported items!'})
    }
    
    var query = {}
    var str = '{' + changeItem + ':' + value + '}'
    var obj = eval('(' + str + ')')
    var change = {$set: obj}
    
    if (target === modelMessage) {
      query = {
        _id: path
      }
    } else {
      query = {
        url: path
      }
    }
    
    target.update(query, change, function (err, doc) {
      if (err) next(err)
      res.send({status: 0})
    })
  },
  postDeleteContents: function (req, res, next) {
    var target = req.body.target
    target = modelObj[target]
    var path = req.body.path
    
    if (target === modelMessage) {
      query = {
        _id: path
      }
    } else {
      query = {
        url: path
      }
    }
    
    target.remove(query, function (err, doc) {
      if (err) next(err)
      
      res.send({status: 0})
    })
  }
}
