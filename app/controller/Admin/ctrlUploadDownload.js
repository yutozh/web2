var qiniu = require('qiniu')
var mongoose = require('mongoose')
var modelResource = mongoose.model('resource')
var moment = require('moment')
var config = require('../../../configure')
var Geetest = require('gt3-sdk')
var crypto = require('crypto')

module.exports = {
  uploadToken: function (req, res, next) {
    var accessKey = config.qnAK
    var secretKey = config.qnSK
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    var options = {
      scope: config.resBucket
    }
    var putPolicy = new qiniu.rs.PutPolicy(options)
    var uploadToken = putPolicy.uploadToken(mac)
    res.send({'uptoken': uploadToken})
  },
  
  qcloudToken: function (req, res, next) {
    var type = req.query.type
    
    var appid = config.qcAppid
    var bucket = config.qcBucketRes
    var sid = config.qcSecretID
    var t = (Date.now() / 1000).toString()
    var e = ((Date.now() / 1000) + 600).toString()
    var rand = parseInt(Math.random() * 1000).toString()
    var origin = ''
    
    if (type === 'multi') {
      origin = 'a=' + appid + '&b=' + bucket + '&k=' + sid + '&e=' + e + '&t=' + t + '&r=' + rand + '&f='
    } else if (type === 'single') {
      origin = 'a=' + appid + '&b=' + bucket + '&k=' + sid + '&e=0&t=' + t + '&f=' + req.query.file
    }
    
    var signTempBuf = crypto.createHmac('sha1', config.qcSecretKey).update(origin).digest()
    var originBuf = new Buffer(origin)
    var bufList = [signTempBuf, originBuf]
    var sign = Buffer.concat(bufList).toString('base64')
    
    res.send({'sign': sign})
  },
  
  
  uploadResInfo: function (req, res, next) {
    var key = req.body.key
    var size = req.body.size
    var filename = req.body.filename
    var postfix = filename.split('.').pop()
    var filetype = '其他'
    var typeList = {
      '文档': ['doc', 'docx', 'pdf'],
      '软件': ['exe'],
      '数据': ['dat', 'txt', 'xls', 'xlsx'],
      '视频': ['mp4', 'flv'],
      '图片': ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'tif']
    }
    if (postfix) {
      for (var i in typeList) {
        var length = typeList[i].length
        for (var j = 0; j < length; j++) {
          if (typeList[i][j] === postfix) {
            filetype = i
            break
          }
        }
        if (filetype !== '其他') {
          break
        }
      }
    }
    var item = new modelResource(
      {
        url: key,
        name: filename,
        size: size,
        desc: '',
        detail: '',
        date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
        downloadNum: 0,
        auth: '公开',
        view: 0,
        author: 'default',
        type: filetype,
        password: '',
        hide: false
      }
    )
    item.save(function (err) {
      if (err) {
        next(err)
        return
      }
      res.send({status: 0})
    })
  },
  updateResInfo: function (req, res, next) {
    var desc = req.body.desc
    var detail = req.body.detail
    var auth = req.body.auth
    var password = req.body.password
    var url = req.body.url
    
    modelResource.update({url: url}, {
      $set: {
        desc: desc,
        detail: detail,
        auth: auth,
        password: password
      }
    }, function (err, doc) {
      if (err) {
        next(err)
        return
      }
      if (doc.n >= 1) {
        res.send({status: 0})
      } else {
        res.send({status: -1, msg: '找不到此文件!'})
      }
    })
  },
  getResourceUrl: function (req, res, next) {
    var url = req.query.url
    var password = req.query.password
    
    var captcha = new Geetest({
      geetest_id: config.geetest_id,
      geetest_key: config.geetest_key
    })
    captcha.validate(req.session.fallback, {
      geetest_challenge: req.query.geetest_challenge,
      geetest_validate: req.query.geetest_validate,
      geetest_seccode: req.query.geetest_seccode
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else if (!success) {
        res.send({status: -2, msg: '验证码异常，请重新尝试'})
      } else {
        modelResource.findOneAndUpdate(
          {url: url, password: password},
          {$inc: {downloadNum: 1}}, function (err, docs) {
            if (err) {
              next(err)
              return
            }
            if (docs) {
              var mac = new qiniu.auth.digest.Mac(config.qnAK, config.qnSK)
              var configQN = new qiniu.conf.Config()
              var bucketManager = new qiniu.rs.BucketManager(mac, configQN)
              var privateBucketDomain = config.resBucketDomain
              var deadline = parseInt(Date.now() / 1000) + 3600 // 1小时过期
              var privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, url, deadline)
              
              privateDownloadUrl = privateDownloadUrl.replace(/qn-res/, 'file-res')
              res.send({status: 0, url: privateDownloadUrl})
            }
            else {
              res.send({status: -1, msg: '密钥输入有误'})
            }
          }
        )
      }
    })
  },
}
