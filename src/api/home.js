/**
 * 首页相关接口
 */

import request from '@/utils/request'

/**
 * 查询获取刀模具列表
 */

export function queryDiePatterns (query) {
  return request({
    url: '/api/_search/die-patterns',
    method: 'get',
    params: query
  })
}

/**
 * 查询获取我的定制列表
 */

export function queryCustomTemplates (query) {
  return request({
    url: '/api/_search/user/custom-templates',
    method: 'get',
    params: query
  })
}

/**
 * 获取我的定制列表
 */
export function queryAllCustomTemplates (userid, query) {
  return request({
    url: `/api/custom-templates/user/${userid}`,
    method: 'get',
    params: query
  })
}

/**
 * 获取计算机品牌
 */
export function queryAllComputerTypes (query) {
  return request({
    url: `/api/computer-types`,
    method: 'get',
    params: query
  })
}

/**
 * 根据定制编号获取定制模版
 */
export function queryCustomTemplatesByCustomNumber (customNumber, query) {
  return request({
    url: `/api/custom-templates/custom-number/${customNumber}`,
    method: 'get',
    params: query
  })
}

/**
 * 保存自定义模具信息
 */
export function saveCustomTemplates (data) {
  return request({
    url: '/api/custom-templates',
    method: 'post',
    data
  })
}

/**
 * 更新自定义模具信息
 */
export function updateCustomTemplates (data) {
  return request({
    url: '/api/custom-templates',
    method: 'put',
    data
  })
}
