var Geetest = require('gt3-sdk')
var config = require('../../configure')

module.exports = {
  getCaptcha: function (req, res, next) {
    var captcha = new Geetest({
      geetest_id: config.geetest_id,
      geetest_key: config.geetest_key
    })
    captcha.register(null, function (err, data) {
      if (err) {
        console.error(err)
        return
      }
      if (!data.success) {
        req.session.fallback = true
        res.send(data)
      } else {
        req.session.fallback = false
        res.send(data)
      }
    })
  }
}
