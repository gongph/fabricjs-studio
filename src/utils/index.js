// 图片根路径
export const baseImgUrl = 'http://th.minio.boyuanziben.cn'
/**
 * base64  to blob二进制
 */

export function dataURItoBlob (dataURI) {
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // mime类型
  const byteString = atob(dataURI.split(',')[1]) // base64 解码
  const arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
  const intArray = new Uint8Array(arrayBuffer) // 创建视图

  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i)
  }
  return new Blob([intArray], { type: mimeString })
}

/**
 * 格式化日期
 */

export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
    f: date.getMilliseconds()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a|f)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 自动生成 Uuid
 * 用于刀模具编号
 */

export function gererateUUID () {
  return 'DJ' + (Math.floor(Math.random() * 99) + 1) + parseTime(new Date(), '{y}{m}{d}{h}{i}{s}{f}')
}

/**
 * 获取唯一id
 */
export function getUuid () {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}
