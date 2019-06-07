/**
 * 工作台
 */

import * as Api from '@/api/studio'
import { cloneDeep } from 'lodash'

const studio = {
  state: {
    // 画布
    canvas: null,
    // 激活对象
    activeObject: null,
    // 官方图库类型
    galleryTypes: [],
    // 官方图库
    gallerys: [],
    // 图层
    layers: [],
    // 设置素材对象
    fabricDesign: null
  },
  mutations: {
    SET_CANVAS: (state, canvas) => {
      state.canvas = canvas
    },
    SET_ACTIVE_OBJECT: (state, activeObject) => {
      state.activeObject = activeObject
    },
    DEL_ACTIVE_OBJECT: (state) => {
      state.activeObject = null
    },
    SET_GALLERYTYPES: (state, data) => {
      state.galleryTypes = data
    },
    SET_GALLERYS: (state, data) => {
      state.gallerys = data
    },
    SET_LAYERS: (state, object) => {
      state.layers.push(object)
    },
    CLEAR_LAYERS: (state) => {
      state.layers = []
    }
  },
  actions: {
    /**
     * 设置 Canvas 实例
     */
    setCanvas ({ commit }, canvas) {
      commit('SET_CANVAS', canvas)
    },
    /**
     * 设置当前激活的 Canvas 对象
     */
    setActiveObject ({ commit }, activeObject) {
      return new Promise(resolve => {
        commit('SET_ACTIVE_OBJECT', activeObject)
        resolve()
      })
    },
    /**
     * 清空当前激活的 Canvas 对象
     */
    delActiveObject ({ commit }) {
      commit('DEL_ACTIVE_OBJECT')
    },
    /**
     * 获取官方图库分类
     */
    getGalleryTypes ({ commit }) {
      return new Promise((resolve, reject) => {
        Api.fetchImageTypes().then(response => {
          if (response.status !== 200) reject(new Error('fetchImageTypes: error'))
          commit('SET_GALLERYTYPES', response.data)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 根绝分类Id获取图库
     * @param  {String|Number} typeId 图片类型Id
     */
    getGalleryByTypeId ({ commit }, typeId) {
      return new Promise((resolve, reject) => {
        if (!typeId) {
          Api.fetchImages().then(response => {
            if (response.status !== 200) reject(new Error('fetchImages: error'))
            commit('SET_GALLERYS', response.data)
          })
        } else {
          Api.fetchImagesByTypeId(typeId).then(response => {
            if (response.status !== 200) reject(new Error('fetchImagesByTypeId: error'))
            commit('SET_GALLERYS', response.data)
          })
        }
      })
    },
    /**
     * 根据Id获取Fabric’s json 文件
     * @param  {String|Number} id 定制编号或定制id
     */
    getFabricJsonById ({ commit }, id) {
      return new Promise((resolve, reject) => {
        debugger
        // 1. 只能用id查询，如果用定制编号查询的话，会出现两条记录一条是笔记本，一条是贴膜的
        Api.getFabricDesignMaterialsByCustomId(id).then(response => {
          if (!response.status === 200) return reject(new Error('getFabricJsonById: error'))
          const data = response.data.length > 0 ? response.data[0] : null
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 保存/更新设计素材
     */
    saveOrUpdateFabricDesign ({ commit, getters }, jsonStr) {
      return new Promise((resolve, reject) => {
        const data = cloneDeep(getters.cacheSavedCustomTemplate)
        // 定制素材数据格式
        let design = { originJson: jsonStr, customTemplate: data }
        // 1. 查询当前的定制模版是否已经存在定制的素材
        // 2。 如果当前定制模版存在定制素材，则调用更新接口
        // 3。 如果当前定制模版不存在定制素材，则调用保存接口
        Api.getFabricDesignMaterialsByCustomId(data.id).then(response => {
          if (response.status === 200 && response.data && response.data.length > 0) {
            design = response.data[0]
            // 把更改过的值设置上，其他的值从服务器上读取
            design.originJson = jsonStr
            Api.updateFabricDesignMaterials(design).then(response => {
              if (response.status !== 200) reject(new Error('updateOrUpdateFabricDesign: error'))
              resolve(response)
            }).catch(err => {
              reject(err)
            })
          } else {
            Api.saveFabricDesignMaterials(design).then(response => {
              if (response.status !== 201) reject(new Error('saveOrUpdateFabricDesign: error'))
              resolve(response)
            }).catch(err => {
              reject(err)
            })
          }
        })
      })
    },
    /**
     * 添加图层
     */
    pushLayer ({ commit }, object) {
      return new Promise(resolve => {
        commit('SET_LAYERS', object)
        resolve()
      })
    },
    /**
     * 清空图层
     */
    clearLayers ({ commit }) {
      commit('CLEAR_LAYERS')
    },
    /**
     * 删除图层
     */
    removeLayer ({ getters }, id) {
      return new Promise(resolve => {
        const arr = getters.layers
        arr.forEach((item, index) => {
          if (item.id === id) {
            arr.splice(index, 1)
          }
        })
        resolve()
      })
    },
    /**
     * 设置图层属性
     */
    setLayerValue ({ getters }, prod) {
      return new Promise(resolve => {
        const arr = getters.layers
        arr.forEach((item, index) => {
          if (item.id === prod.id) {
            item[prod.key] = prod.value
          }
        })
        resolve()
      })
    }
  }
}

export default studio
