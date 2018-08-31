var Geetest = require('gt3-sdk')
var config = require('../../../configure')
var path = require('path')

module.exports = {
  loginRequired: function (req, res, next) {
    if (!config.DEBUG && req.session.adminUser !== config.rootUser) {
      if (req.path.startsWith('/admin.html')) {
        return res.redirect('/admin.html')
      } else {
        return res.send(401)
      }
    } else {
      next()
    }
  },
  getAdmin: function (req, res, next) {
    res.sendFile(path.join(__dirname, '../../../dist', 'admin.html'))
  },
  postLogin: function (req, res, next) {
    var captcha = new Geetest({
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
        if (req.body.username === config.rootUser && req.body.password === config.rootPsd) {
          req.session.adminUser = req.body.username
          res.send({status: 0})
        } else {
          res.send({status: -1, msg: '用户名或密码错误'})
        }
      }
    })
  },
  getLoginOut: function (req, res, next) {
    req.session.adminUser = null
    return res.send(401)
  }
}
