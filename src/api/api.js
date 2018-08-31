// const config = require('../../config')
// let _config = process.env.NODE_ENV === 'production' ? config.build : config.dev
// let port = process.env.NODE_ENV === 'production' ? ':3000' : ':8080'
let host = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'

let indexAPI = host + '/indexAPI'
let adminAPI = host + '/adminAPI'
let appAPI = host + '/appAPI'
export default {
  host,
  indexAPI: {
    knowledgeContent: indexAPI + '/knowledgeContent',
    questionContent: indexAPI + '/questionContent',
    resourceContent: indexAPI + '/resourceContent',
    questionVote: indexAPI + '/questionVote',
    knowledgeLike: indexAPI + '/knowledgeLike',
    homeKnowledge: indexAPI + '/homeKnowledge',
    homeQuestion: indexAPI + '/homeQuestion',
    homeResource: indexAPI + '/homeResource',
    knowledge: indexAPI + '/knowledge',
    message: indexAPI + '/message',
    postMessage: indexAPI + '/postMessage',
    question: indexAPI + '/question',
    resource: indexAPI + '/resource',
    tags: indexAPI + '/tags',
    getResourceUrl: indexAPI + '/getResourceUrl'
  },
  adminAPI: {
    getCaptcha: adminAPI + '/getCaptcha',
    postLogin: adminAPI + '/postLogin',
    loginOut: adminAPI + '/loginOut',
    getRunningDatasAdmin: adminAPI + '/getRunningDatasAdmin',
    postAddRunningDatasAdmin: adminAPI + '/postAddRunningDatasAdmin',
    getContents: adminAPI + '/getContents',
    postContents: adminAPI + '/postContents',
    uploadTokenQC: adminAPI + '/uploadTokenQC',
    uploadToken: adminAPI + '/uploadToken',
    uploadResInfo: adminAPI + '/uploadResInfo',
    postChangeContents: adminAPI + '/postChangeContents',
    getLists: adminAPI + '/getLists',
    postDeleteContents: adminAPI + '/postDeleteContents'
  },
  appAPI: {
    getRunningDatas: appAPI + '/getRunningDatas',
    getRunningDatasAdmin: appAPI + '/getRunningDatasAdmin',
    postDeleteRunningDatasAdmin: appAPI + '/postDeleteRunningDatasAdmin',
    postAddRunningDatasAdmin: appAPI + '/postAddRunningDatasAdmin'
  }
}
