import router from '@/pages/admin/route'
import axios from 'axios'
// http 拦截器

// http response 拦截器
axios.interceptors.response.use(
  response => {
    switch (response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        localStorage.removeItem('login')
        if (router.currentRoute.name !== 'login') {
          router.replace({
            path: '/login',
            query: {redirect: router.currentRoute.fullPath}
          })
        }
        break
    }
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          localStorage.removeItem('login')
          if (router.currentRoute.name !== 'login') {
            router.replace({
              path: '/login',
              query: {redirect: router.currentRoute.fullPath}
            })
          }
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

export default axios
