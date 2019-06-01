/**
 * 工作台相关接口
 */

import request from '@/utils/request'

/**
 * 获取官方图库分类
 */

export function fetchImageTypes () {
  return request({
    url: '/api/image-types',
    method: 'get'
  })
}

/**
 * 获取所有的官方图库
 */

export function fetchImages () {
  return request({
    url: '/api/official-galleries',
    method: 'get'
  })
}

/**
 * 获取某一分类下的所有图片
 */

export function fetchImagesByTypeId (typeId) {
  return request({
    url: `/api/official-galleries/image-type/${typeId}`,
    method: 'get'
  })
}

/**
 * 编辑自定义模板
 */

export function updateCustomTemplates (data) {
  return request({
    url: '/api/custom-templates',
    method: 'put',
    data
  })
}
