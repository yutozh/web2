var path = require('path')
var mongoose = require('mongoose')
var modelKnowledge = mongoose.model('knowledge')
var modelQuestion = mongoose.model('question')
var modelResource = mongoose.model('resource')
var modelMessage = mongoose.model('message')
var config = require('../../configure')

module.exports = {
  getHome: function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../dist', 'index.html'))
  },
  getHomeKnowledge: function (req, res, next) {
    modelKnowledge
      .find({hide: false}, {'__v': 0, 'hide': 0})
      .sort({'_id': -1})
      .limit(config.homeKnowledgeSize)
      .exec(function (err, docs) {
        if (err) return next(err)
        res.send({status: 0, content: docs})
      })
  },
  getHomeQuestion: function (req, res, next) {
    modelQuestion
      .find({hide: false}, {'__v': 0, 'hide': 0})
      .sort({'_id': -1})
      .limit(config.homeQuestionSize)
      .exec(function (err, docs) {
        if (err) return next(err)
        res.send({status: 0, content: docs})
      })
  },
  getHomeResource: function (req, res, next) {
    modelResource
      .find({hide: false}, {'__v': 0, 'hide': 0})
      .sort({'_id': -1})
      .limit(config.homeResourceSize)
      .exec(function (err, docs) {
        if (err) return next(err)
        res.send({status: 0, content: docs})
      })
  }
}


function addKnowledge () {
  var item = new modelKnowledge(
    {
      url: Date.now(), title: '文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题',
      date: '2017-07-25', view: 233, like: 0, body: '文章标题文章标题文章标题文章标题文' +
      '章标题文章标题文章标题标题文章标题文章标题标题文章标题文章标题文章标题', author: 'default',
      tags: ['文章', 'C#', 'javascript'], hide: false
    }
  )
  item.save(function (err) {
    if (err) {
      console.log(err.message)
    }
  })
}

function addQuestion () {
  var item = new modelQuestion(
    {
      title: 'hg dasdsad   是是的撒大所是  是是是 dddasddas',
      date: '2017-07-09',
      view: 258,
      author: 'happy',
      body: 'questionquestionquestionquestionquestionquestionquestionquestionquestionquestionquestion' +
      'questionquestionquestionquestionquestionquestionquestionquestionquestionquestion',
      pros: 255,
      cons: 255,
      hide: false,
      tags: ['1', '2', '3'],
      url: '1'
    }
  )
  item.save(function (err) {
    if (err) {
      console.log(err.message)
    }
  })
}

function addResource () {
  var item = new modelResource(
    {
      url: '21211232331', name: 'xxx.doc', desc: 'hahahah', detail: 'detaildetaildetail'
      , date: '2017-07-07', downloadNum: 0
      , auth: '其他', view: 0, author: 'default', type: '软件', hide: false, size: '100KB', password
    }
  )
  item.save(function (err) {
    if (err) {
      console.log(err.status)
    }
  })
}

function addMessage () {
  var item = new modelMessage(
    {
      body: '文章标题文章标题文章标题文章标题文章标题文章标题文章标题文章标题',
      author: 'default', view: 0, date: '2017-07-25', hide: false
    }
  )
  item.save(function (err) {
    if (err) {
      console.log(err.status)
    }
  })
}
