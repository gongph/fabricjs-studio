import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import getters from './getters'
import studio from './modules/studio'
import user from './modules/user'
import home from './modules/home'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    studio,
    user,
    home
  },
  getters,
  plugins: [
    createPersistedState({
      // 指定哪些数据需要缓冲
      paths: [
        'user.user',
        'home.cacheDiePattern',
        'home.customeTemplate.taobaoNickname',
        'home.customeTemplate.theRecipientName',
        'home.sbdDiePattern',
        'studio.galleryTypes',
        'studio.fabricDesign'
      ]
    })
  ]
})
