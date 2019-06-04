/**
 * 工作台
 */

import * as Api from '@/api/studio'

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
    layers: []
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
    SET_CLEAN_LAYERS: (state, object) => {
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
     * 添加图层
     */
    pushLayer ({ commit }, object) {
      return new Promise(resolve => {
        commit('SET_LAYERS', object)
        resolve()
      })
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
