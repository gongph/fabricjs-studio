import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

// A modern alternative to CSS resets
import 'normalize.css/normalize.css'

import MuseUI from 'muse-ui'
import Toast from 'muse-ui-toast'
import 'muse-ui/dist/muse-ui.css'
import theme from 'muse-ui/lib/theme'

// Custome style
import './styles/index.scss'
import './icons/index'

import './permission'

// Material design icons
import 'material-design-icons/iconfont/material-icons.css'
// Progress style
import 'muse-ui-progress/dist/muse-ui-progress.css'
import NProgress from 'muse-ui-progress'
// Loading style
import 'muse-ui-loading/dist/muse-ui-loading.css'
import Loading from 'muse-ui-loading'
// Message style
import 'muse-ui-message/dist/muse-ui-message.css'
import Message from 'muse-ui-message'

import { fabric } from 'fabric'

theme.add('darkTheme', {
  primary: '#333',
  secondary: '#ff4081',
  success: '#4caf50',
  warning: '#ffeb3b'
}, 'dark')

theme.use('darkTheme')

Vue.use(Toast)
Vue.use(MuseUI)
Vue.use(NProgress)
Vue.use(Loading)
Vue.use(Message)

Vue.prototype.$fabric = fabric
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
