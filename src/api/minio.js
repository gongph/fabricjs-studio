import request from '@/utils/request'

/**
 * 获取Minio凭证
 */

export function getMinioToken () {
  return request({
    url: '/api/minio/token',
    method: 'get'
  })
}
