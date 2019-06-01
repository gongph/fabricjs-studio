/**
 * 使用 Minio 上传图片
 * 相关文档： https://docs.min.io/docs/javascript-client-quickstart-guide.html
 */

import { getMinioToken } from '@/api/minio'
import { dataURItoBlob, getUuid } from './index.js'
const Minio = require('minio')
const ReadableBlobStream = require('readable-blob-stream')
const fileReaderStream = require('filereader-stream')

let minioClient = null

getMinioToken().then(response => {
  if (response && response.data) {
    /* eslint-disable */ 
    const { region, port, useSSL, ...conf } = response.data
    minioClient = new Minio.Client(
      Object.assign({ useSSL: useSSL === 'true' ? true : false }, conf)
    )
  }
})

/**
 * 上传
 * @param {String} bucketName 桶名 `fabric-design` 存放素材，`product-design` 存放成品图
 */

export function uploadify (obj, bucketName = 'fabric-design') {
  if (!obj) return

  let ext = ''
  let fileStream = null
  const uuid = getUuid()
  let fileName = ''
  let metaData = ''

  if (obj instanceof File) {
    ext = /\.[^\.]+$/.exec(obj.name)[0]
    fileStream = fileReaderStream(obj)
    fileName = uuid + ext
    metaData = {
      'Content-Type': fileStream.type
    }
  } else {
    ext = '.jpg'
    fileName = uuid + ext
    metaData = {
      'Content-Type': 'image/jpeg'
    }
    let blob = dataURItoBlob(obj)
    fileStream = new ReadableBlobStream(blob)
  }
  
  return new Promise((resolve, reject) => {
    minioClient.putObject(
      bucketName,
      fileName,
      fileStream,
      metaData,
      err => {
        if (err) reject(err)
        console.log(`File '${fileName}' upload successfully.`)
        resolve({
          bucketName,
          fileName
        })
      }
    )
  })
}
