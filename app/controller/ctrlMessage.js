let mongoose = require('mongoose')
let modelMessage = mongoose.model('message')
let config = require('../../configure')
let request = require('request')
let moment = require('moment')
let Geetest = require('gt3-sdk')

module.exports = {
  getMessage: function (req, res, next) {
    // get number of all items
    modelMessage.find({}).count().exec(function (err, docs) {
      if (err) return next(err)
      let allItems = docs
      // find message randomly
      let skip = Math.abs(Math.floor(Math.random() * allItems) - 9)
      modelMessage
        .find({hide: false}, {'__v': 0, 'hide': 0})
        .sort({'_id': -1})
        .skip(skip)
        .limit(config.messageSize)
        .exec(function (err, docs) {
          if (err) return next(err)
          for (let i in docs) {
            docs[i].view += 1
            docs[i].save(function (err) {
              if (err) console.error(err)
            })
          }
          res.send({status: 0, content: docs, allItems: allItems})
        })
    })
  },
  postMessage: function (req, res, next) {
    let content = req.body.content
    let ip = getClientIp(req)
    let captcha = new Geetest({
      geetest_id: config.geetest_id,
      geetest_key: config.geetest_key
    })
    captcha.validate(req.session.fallback, {
      geetest_challenge: req.body.geetest_challenge,
      geetest_validate: req.body.geetest_validate,
      geetest_seccode: req.body.geetest_seccode
    }, function (err, success) {
      if (err) {
        res.send(err)
      } else if (!success) {
        res.send({status: -2, msg: '验证码异常，请重新尝试'})
      } else {
        // get region
        let reqUrl = 'http://route.showapi.com/1372-1' +
          '?showapi_appid=' + config.YYappid +
          '&showapi_timestamp=' + moment(Date.now()).format('YYYYMMDDHHmmss') +
          '&showapi_sign=' + config.YYsecret +
          '&ip=' + ip
        request(reqUrl, function (error, response, body) {
          if (!error && response.statusCode === 200) {
            let resBody = JSON.parse(body)['showapi_res_body']
            if (resBody['ret_code'] === 0) {
              let regionList = resBody.region.split('|')
              let city = ''
              if (regionList[0] !== '0') {
                city += regionList[0]
              }
              if (regionList[2] !== '0') {
                city += regionList[2]
              }
              if (regionList[3] !== '0' && regionList[2] !== regionList[3]) {
                city += regionList[3]
              }
              if (city === '') {
                city = ip
              }
              city = '来自' + city + '的网友'
              let item = new modelMessage({
                body: content,
                author: city,
                view: 0,
                date: moment(Date.now()).format('YYYY-MM-DD HH:mm'),
                hide: false
              })
              item.save(function (err) {
                if (err) {
                  next(err)
                  return
                }
                res.send({status: 0})
              })
              return
            }
          }
          res.send({status: -1, msg: '接口异常,请稍候再试'})
        })
      }
    })
  }
}

function getClientIp (req) {
  let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7)
  }
  return ip
}
