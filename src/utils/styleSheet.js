/**
 * 动态创建CSS样式
 */

import URL from '@/utils/url.js'

const sheet = (function createStyleSheet () {
  const head = document.head || document.getElementByTagName('head')[0]
  const style = document.createElement('style')
  style.id = 'dynamic-font-style'
  style.type = 'text/css'
  head.appendChild(style)
  return style
})()

/**
 * 添加CSS规则
 * @param {String} selector 选择器
 * @param {Array} fonts 后台字体数组
 */
export function addFontsRule (fonts) {
  const fragment = document.createDocumentFragment()
  fonts.forEach(font => {
    fragment.appendChild(document.createTextNode(`
      @font-face {
        font-family: a;
        src: url('${URL.baseFileURL}${font.name}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `))
  })
  sheet.appendChild(fragment)
}
