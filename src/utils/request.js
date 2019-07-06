/**
 * Axios 配置
 */

import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  // baseURL: 'http://new-api.boyuanziben.cn',
  // baseURL: 'http://localhost:8080',
  baseURL: 'http://api.xintonglu.top',
  timeout: 50000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error)
  }
)

export default service
