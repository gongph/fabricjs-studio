/**
 * 字体接口
 */

import request from '@/utils/request'

export function fetchFonts () {
  return request({
    url: '/api/font-types',
    methods: 'get'
  })
}
