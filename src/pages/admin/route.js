import Vue from 'vue'
import Router from 'vue-router'

// import login          from './adminLogin.vue'
// import index          from './adminIndex.vue'
// import home           from './logined/home.vue'
// import manageKnowledge from './logined/manageKnowledge.vue'
// import manageQuestion from './logined/manageQuestion.vue'
// import manageResource from './logined/manageResource.vue'
// import manageMessage  from './logined/manageMessage.vue'
// import addKQM         from './logined/addKQM.vue'
// import addResource    from './logined/addResource.vue'
// const admin = (resolve) => {require.ensure([], function(){resolve(require('./admin.vue'));}, 'adminMain');};
const login = (resolve) => {
  require.ensure([], function () {
    resolve(require('./adminLogin.vue'))
  }, 'adminLogin')
}
const index = (resolve) => {
  require.ensure([], function () {
    resolve(require('./adminIndex.vue'))
  }, 'adminIndex')
}
const home = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/home.vue'))
  }, 'adminHome')
}
const manageKnowledge = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/manageKnowledge.vue'))
  }, 'manageKnowledge')
}
const manageQuestion = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/manageQuestion.vue'))
  }, 'manageQuestion')
}
const manageResource = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/manageResource.vue'))
  }, 'manageResource')
}
const manageMessage = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/manageMessage.vue'))
  }, 'manageMessage')
}
const addKQM = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/addKQM.vue'))
  }, 'addKQM')
}
const addResource = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/addResource.vue'))
  }, 'addResource')
}

const running = (resolve) => {
  require.ensure([], function () {
    resolve(require('../../components/admin/Application/appRunning.vue'))
  }, 'running')
}

Vue.use(Router)

const routes = [
  {
    path: '/login', component: login
  },
  {
    path: '/',
    component: index,
    children: [
      {
        path: '', component: home
      },
      {
        path: 'manageKnowledge', component: manageKnowledge
      },
      {
        path: 'manageQuestion', component: manageQuestion
      },
      {
        path: 'manageResource', component: manageResource
      },
      {
        path: 'manageMessage', component: manageMessage
      },
      {
        path: 'addKQM', component: addKQM
      },
      {
        path: 'addResource', component: addResource
      },
      {
        path: 'appRunning', component: running
      },
      {
        path: '*', redirect: '/admin'
      }
    ]
  }
]

export default new Router({
  // mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})
