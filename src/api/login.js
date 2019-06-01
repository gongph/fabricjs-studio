/**
 * 登录相关接口
 */

import request from '@/utils/request'

export function signIn (data) {
  return request({
    url: '/api/authenticate',
    method: 'post',
    data
  })
}

export function getAccount () {
  return request({
    url: '/api/account',
    method: 'get'
  })
}
