import Vue from 'vue'
import Router from 'vue-router'

import home from '@/components/router-view/home.vue'
// import knowledge            from './Components/router-view/knowledge.vue'
// import question             from './Components/router-view/question.vue'
// import resource             from './Components/router-view/resource.vue'
// import message              from './Components/router-view/message.vue'
// import knowledgeContent     from './Components/content/knowledgeContent.vue'
// import questionContent      from './Components/content/questionContent.vue'
// import resourceContent      from './Components/content/resourceContent.vue'
// import tag                  from './Components/router-view/tag.vue'
// import notFound             from './Components/404.vue'

// const App             = (resolve) => {require.ensure([], function(){resolve(require('./App.vue'));}, 'app');};
// const home            = (resolve) => {require.ensure([], function(){resolve(require('./Components/router-view/home.vue'));}, 'home');};
const knowledge = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/router-view/knowledge.vue'))
  }, 'knowledge')
}
const question = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/router-view/question.vue'))
  }, 'question')
}
const resource = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/router-view/resource.vue'))
  }, 'resource')
}
const message = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/router-view/message.vue'))
  }, 'message')
}
const knowledgeContent = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/content/knowledgeContent.vue'))
  }, 'knowledgeContent')
}
const questionContent = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/content/questionContent.vue'))
  }, 'questionContent')
}
const resourceContent = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/content/resourceContent.vue'))
  }, 'resourceContent')
}
const tag = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/router-view/tag.vue'))
  }, 'tag')
}
const notFound = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/404.vue'))
  }, 'notFound')
}
const running = (resolve) => {
  require.ensure([], function () {
    resolve(require('@/components/application/running.vue'))
  }, 'running')
}

Vue.use(Router)

const routes = [
  {
    path: '/', component: home
  },
  {
    path: '/knowledge', component: knowledge
  },
  {
    path: '/question', component: question
  },
  {
    path: '/resource', component: resource
  },
  {
    path: '/message', component: message
  },
  {
    path: '/knowledge/content/:name', component: knowledgeContent // 文章内容
  },
  {
    path: '/question/content/:name', component: questionContent // 问题内容
  },
  {
    path: '/resource/content/:id', component: resourceContent // 下载内容
  },
  {
    path: '/:column/tag/:name', component: tag
  },
  {
    path: '/app/running', component: running
  },
  {
    path: '*', component: notFound
  }
]

export default new Router({
  mode: 'history',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {x: 0, y: 0}
    }
  }
})
