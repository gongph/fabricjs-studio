/**
 * 用户
 */

import { getToken, setToken, removeToken } from '@/utils/auth'
import { signIn, getAccount } from '@/api/login'
import { changePassword } from '@/api/user'

const user = {
  state: {
    token: getToken(),
    roles: [],
    user: null,
    name: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_NAME: (state, name) => {
      state.name = name
    }
  },
  actions: {
    signIn ({ commit }, data) {
      return new Promise((resolve, reject) => {
        signIn(data).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.id_token)
          setToken(data.id_token)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    signOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USER', '')
        commit('SET_NAME', '')
        commit('SET_ROLES', '')
        removeToken()
        resolve()
      })
    },
    getLoginUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getAccount().then(response => {
          if (!response.data) reject(new Error('error'))
          const data = response.data
          if (data.authorities && data.authorities.length > 0) {
            commit('SET_ROLES', data.authorities)
          } else {
            reject(new Error('getLoginUserInfo: roles must be a non-null array!'))
          }
          commit('SET_USER', data)
          commit('SET_NAME', data.login)
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    changePassword ({ commit }, data) {
      return new Promise((resolve, reject) => {
        changePassword(data).then(response => {
          if (response.status !== 200) reject(new Error('error'))
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default user
