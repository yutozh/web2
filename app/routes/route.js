let express = require('express')
let path = require('path')

let route = express.Router()

let fun1 = require('../controller/ctrlHome')
let fun2 = require('../controller/ctrlKnowledge')
let fun3 = require('../controller/ctrlQuestion')
let fun4 = require('../controller/ctrlResource')
let fun5 = require('../controller/ctrlMessage')
let fun6 = require('../controller/ctrlTags')

let admin1 = require('../controller/Admin/ctrlLogin')
let admin2 = require('../controller/Admin/ctrlManage')
let admin3 = require('../controller/Admin/ctrlUploadDownload')

let captcha = require('../controller/ctrlCaptcha')

let app1 = require('../controller/Application/Running/ctrlRunning')

route.get('/', fun1.getHome)
route.get('/indexAPI/homeKnowledge', fun1.getHomeKnowledge)
route.get('/indexAPI/homeQuestion', fun1.getHomeQuestion)
route.get('/indexAPI/homeResource', fun1.getHomeResource)

route.get('/indexAPI/knowledge', fun2.getKnowledge)
route.get('/indexAPI/question', fun3.getQuestion)
route.get('/indexAPI/resource', fun4.getResource)
route.get('/indexAPI/message', fun5.getMessage)

route.get('/indexAPI/knowledgeContent', fun2.getKnowledgeContent)
route.post('/indexAPI/knowledgeLike', fun2.postKnowledgeLike)

route.get('/indexAPI/questionContent', fun3.getQuestionContent)
route.post('/indexAPI/questionVote', fun3.postQuestionVote)

route.get('/indexAPI/resourceContent', fun4.getResourceContent)
route.get('/indexAPI/getResourceUrl', admin3.getResourceUrl)

route.post('/indexAPI/postMessage', fun5.postMessage)

route.get('/indexAPI/tags', fun6.getTags)

route.get('/admin.html/login', admin1.getAdmin)
route.get('/adminAPI/loginOut', admin1.getLoginOut)
route.post('/adminAPI/postLogin', admin1.postLogin)

route.get('/admin.html', admin1.getAdmin)
route.get('/admin.html/*', admin1.getAdmin)

route.get('/adminAPI/getLists', admin1.loginRequired, admin2.getLists)
route.get('/adminAPI/getContents', admin1.loginRequired, admin2.getContents)
route.post('/adminAPI/postContents', admin1.loginRequired, admin2.postContents)
route.post('/adminAPI/postContentsK', admin1.loginRequired, admin2.postContentsK)
route.post('/adminAPI/postContentsQ', admin1.loginRequired, admin2.postContentsQ)
route.post('/adminAPI/postContentsM', admin1.loginRequired, admin2.postContentsM)
route.post('/adminAPI/postChangeContents', admin1.loginRequired, admin2.postChangeContents)
route.post('/adminAPI/postDeleteContents', admin1.loginRequired, admin2.postDeleteContents)

route.get('/adminAPI/uploadToken', admin1.loginRequired, admin3.uploadToken)
// route.get("/adminAPI/uploadTokenQC",admin3.qcloudToken);
route.post('/adminAPI/uploadResInfo', admin1.loginRequired, admin3.uploadResInfo)
route.post('/adminAPI/updateResInfo', admin1.loginRequired, admin3.updateResInfo)

route.get('/adminAPI/getCaptcha', captcha.getCaptcha)

route.get('/appAPI/getRunningDatas', app1.getRunningDatas)
route.get('/appAPI/getRunningDatasAdmin', admin1.loginRequired, app1.getRunningDatasAdmin)
route.post('/appAPI/postAddRunningDatasAdmin', admin1.loginRequired, app1.postRunningDatas)
route.post('/appAPI/postDeleteRunningDatasAdmin', admin1.loginRequired, app1.postDeleteRunningDatas)

// route.get('*', function (req, res, next) {
//   res.sendFile(path.join(__dirname, '../../dist', 'index.html'))
// })
module.exports = route
