/**
 * 用户相关接口
 */

import request from '@/utils/request'

export function changePassword (data) {
  return request({
    url: '/api/account/change-password',
    method: 'post',
    data
  })
}
