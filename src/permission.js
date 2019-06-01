import router from './router'
import store from './store'
import { getToken } from '@/utils/auth'
import Toast from 'muse-ui-toast'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('getLoginUserInfo').then(() => {
          next({ ...to, replace: true })
        }).catch(err => {
          store.dispatch('signOut').then(() => {
            Toast.error({ message: '身份验证失效，请重新登录', position: 'top' })
            console.error(err || 'Verification failed, please login again')
          })
          next({ path: '/' })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
