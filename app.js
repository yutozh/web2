var express = require('express')
var ejs = require('ejs')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var path = require('path')
var FroalaEditor = require('wysiwyg-editor-node-sdk-qn/lib/froalaEditor')

var session = require('express-session')
var config = require('./configure')
var db = require('./mongo')()

var route = require('./app/routes/route')

var app = express()

app.set('views', path.join(__dirname, 'dist'))
app.engine('.html', ejs.__express)
app.set('view engine', 'html')

app.set('trust proxy', 'loopback')
// app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())

// CORS
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})


// session
app.use(session({
////这里的name值得是cookie的name，默认cookie的name是：connect.sid
  name: 'sessionID',
  secret: config.sessionKey,
  // cookie: ('name', 'value', { path: '/', httpOnly: true,secure: false, maxAge:  60000 }),
  //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
  resave: true,
  //强制“未初始化”的会话保存到存储
  saveUninitialized: false,
  
}))


// Path to upload image.
app.post('/upload_image', function (req, res) {
  var options = {
    accessKey: config.qnAK,
    secretKey: config.qnSK,
    bucket: config.articleBucket,
    zone: config.articleZone,
    domain: config.articleDomain,
  }
  // Store image.
  FroalaEditor.Image.uploadQn(req, '../public/upload/', options, function (err, data) {
    // Return data.
    if (err) {
      return res.send(JSON.stringify(err))
    }
    res.send(data)
  })
})
// Path to upload image.
app.post('/upload_file', function (req, res) {
  var options = {
    accessKey: config.qnAK,
    secretKey: config.qnSK,
    bucket: config.articleBucket,
    zone: config.articleZone,
    domain: config.articleDomain,
  }
  // Store image.
  FroalaEditor.File.uploadQn(req, '../public/upload/', options, function (err, data) {
    // Return data.
    if (err) {
      return res.status(404).end(JSON.stringify(err))
    }
    res.send(data)
  })
})


app.use(route)
// /ueditor 入口地址配置 https://github.com/netpi/ueditor/blob/master/example/public/ueditor/ueditor.config.js
// 官方例子是这样的 serverUrl: URL + "php/controller.php"
// 我们要把它改成 serverUrl: URL + 'ue'

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(function (req, res, next) {
  // let err = new Error("Page Not Found");
  // err.status = 404;
  // next(err);
  res.sendFile(path.join(__dirname, './dist', 'index.html'))
})

app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  
  console.log(err)
  res.status(err.status || 500)
  
  res.send({status: -1, reason: err.message})
})
module.exports = app
