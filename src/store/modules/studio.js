/**
 * 工作台
 */

import * as Api from '@/api/studio'
import { fetchFonts } from '@/api/fonts'
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
    fabricDesign: null,
    // 字体
    fonts: [],
    // 模具背景图对象
    dieBg: null,
    // 水印对象
    waterText: null,
    // 收件人水印文字
    waterStr: null,
    // 图形类型 `itext` or `image`
    graphType: '',
    // 展示预览页面的标志
    openPreviewCanvasDialog: false,
    // 当前属性标签页，1 素材属性页，2 定制属性页
    tabActived: 1,
    // 淘宝id
    taobaoId: '',
    // 收件人
    recevier: '',
    // 输入框是否禁用
    fieldDisabled: true
  },
  mutations: {
    SET_CANVAS: (state, canvas) => {
      state.canvas = canvas
    },
    SET_OPEN_PREVIEW_CANVAS_DIALOG: (state, openPreviewCanvasDialog) => {
      state.openPreviewCanvasDialog = openPreviewCanvasDialog
    },
    SET_WATER_STR: (state, waterStr) => {
      state.waterStr = waterStr
    },
    SET_TAOBAOID_RECEVIER: (state, obj) => {
      state.taobaoId = obj.taobaoId
      state.recevier = obj.recevier
    },
    SET_TAB_ACTIVED: (state, tabActived) => {
      state.tabActived = tabActived
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
    },
    SET_FONTS: (state, fonts) => {
      state.fonts = fonts
    },
    SET_DIE_BG: (state, dieBg) => {
      state.dieBg = dieBg
    },
    SET_WATER_TEXT: (state, waterText) => {
      state.waterText = waterText
    },
    SET_GRAPH_TYPE: (state, type) => {
      state.graphType = type
    },
    SET_FIELD_DISABLED: (state, disabled) => {
      state.fieldDisabled = disabled
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
     * 设置预览页面状态
     */
    setOpenPreviewCanvasDialog ({ commit }, openPreviewCanvasDialog) {
      commit('SET_OPEN_PREVIEW_CANVAS_DIALOG', openPreviewCanvasDialog)
    },
    /**
     * 设置淘宝Id和收件人
     */
    setTaobaoidRecevier ({ commit }, obj) {
      commit('SET_TAOBAOID_RECEVIER', obj)
      const waterStr = '淘宝ID：' + obj.taobaoId + '    收件人姓名：' + obj.recevier
      commit('SET_WATER_STR', waterStr)
    },
    /**
     * 设置标签页
     */
    setTabActived ({ commit }, tabActived) {
      commit('SET_TAB_ACTIVED', tabActived)
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
     * 设置模具图背景
     */
    setDiebg ({ commit }, dieBg) {
      commit('SET_DIE_BG', dieBg)
    },
    /**
     * 设置水印对象
     */
    setWaterText ({ commit }, waterText) {
      commit('SET_WATER_TEXT', waterText)
    },
    /**
     * 设置水印对象
     */
    setWaterStr ({ commit }, waterStr) {
      commit('SET_WATER_STR', waterStr)
    },
    /**
     * 更新水印
     * @param commit
     * @param waterStr
     */
    handleWatermark ({ commit, state }, waterStr) {
      if (!state.waterText) return
      state.waterText.set({
        text: state.waterStr
      })
      state.canvas.renderAll()
    },
    /**
     * 设置图形类型
     */
    setGraphType ({ commit }, type) {
      commit('SET_GRAPH_TYPE', type)
    },
    /**
     * 设置输入框禁用状态
     */
    setFieldDisabled ({ commit }, status) {
      commit('SET_FIELD_DISABLED', status)
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
            resolve()
          }).catch(err => {
            reject(err)
          })
        } else {
          Api.fetchImagesByTypeId(typeId).then(response => {
            if (response.status !== 200) reject(new Error('fetchImagesByTypeId: error'))
            commit('SET_GALLERYS', response.data)
            resolve()
          }).catch(err => {
            reject(err)
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
    },
    /**
     * 初始化字体
     */
    initFonts ({ commit }) {
      return new Promise((resolve, reject) => {
        fetchFonts().then(response => {
          if (!response.status === 200) reject(new Error('initFonts: error'))
          commit('SET_FONTS', response.data)
        })
      })
    }
  }
}

export default studio
