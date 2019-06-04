/**
 * 首页
 */

import { queryDiePatterns, queryCustomTemplates, saveCustomTemplates, queryAllCustomTemplates } from '@/api/home'
import { saveFabricDesignMaterials, updateFabricDesignMaterials } from '@/api/studio'
import { gererateUUID } from '@/utils'

const home = {
  state: {
    // 我要定制列表
    bookingList: [],
    bookingTotal: 0,
    // 我的定制列表
    bookedList: [],
    bookedTotal: 0,
    // 鼠标垫模具
    sbdDiePattern: {},
    currentType: {},
    currentCustomeTemplate: {},
    currentFabricDesign: {},
    // 鼠标垫
    sbd: {
      // 定制数量
      customQuantity: 1,
      // 淘宝ID
      taobaoNickname: '',
      // 收件人姓名
      theRecipientName: '',
      // 推荐状态
      recommendedStatus: {
        id: 1
      },
      // 磨具类型： id: 1 贴膜 id: 2 鼠标垫
      modelType: {
        id: 2
      },
      // 完成状态
      finishedCondition: {
        id: 1
      },
      // 定制状态
      customState: {
        id: 1
      },
      // 当前用户
      user: {
        id: -1
      }
    },
    customeTemplate: {
      // 定制编号
      customNumber: '',
      // 定制数量
      customQuantity: 1,
      // 淘宝ID
      taobaoNickname: '',
      // 收件人姓名
      theRecipientName: '',
      // 推荐状态
      recommendedStatus: {
        id: 1
      },
      // 刀模具
      diePattern: null,
      // 磨具类型： id: 1 贴膜 id: 2 鼠标垫
      modelType: {
        id: 1
      },
      // 完成状态
      finishedCondition: {
        id: 1
      },
      // 定制状态
      customState: {
        id: 1
      },
      // 当前用户
      user: {
        id: -1
      }
    },
    // 缓存磨具数据
    diePattern: {
      // 编号
      id: -1,
      // 磨具图路径
      path: '',
      type: 1
    }
  },
  mutations: {
    SET_BOOKING_LIST: (state, data) => {
      state.bookingList = data
    },
    SET_CURRENT_TYPE: (state, data) => {
      state.currentType = data
    },
    SET_SBD: (state, data) => {
      state.sbdDiePattern = data
    },
    SET_BOOKING_TOTAL: (state, total) => {
      state.bookingTotal = total
    },
    SET_BOOKED_LIST: (state, data) => {
      state.bookedList = data
    },
    SET_BOOKED_TOTAL: (state, total) => {
      state.bookedTotal = total
    },
    INIT_TEMPLATE_DATA: (state, data) => {
      // 初始化计算机模板数据
      state.customeTemplate.customNumber = gererateUUID()
      state.customeTemplate.customQuantity = data.customQuantity
      state.customeTemplate.taobaoNickname = data.taobaoNickname
      state.customeTemplate.theRecipientName = data.theRecipientName
      state.customeTemplate.user = data.user
      // 关联上刀模图数据
      state.customeTemplate.diePattern = data

      // 初始化鼠标垫模板数据
      state.sbd.customQuantity = data.customQuantity
      state.sbd.taobaoNickname = data.taobaoNickname
      state.sbd.theRecipientName = data.theRecipientName
      state.sbd.user = data.user
      state.sbd.diePattern = state.sbdDiePattern
      // 设置统一的编号
      state.sbd.customNumber = state.customeTemplate.customNumber
      // 根据按的类型来处里不同的模板
      if (state.currentType === 1) {
        state.diePattern.path = data.diePatternimagePath
      } else {
        state.diePattern.path = state.sbdDiePattern.diePatternimagePath
      }
    },
    EXIT_EDITOR: (state, data) => {
      state.diePattern = {}
      state.currentType = null
      state.currentCustomeTemplate = {}
      state.customeTemplate = {
      // 定制编号
        customNumber: '',
        // 定制数量
        customQuantity: 1,
        // 淘宝ID
        taobaoNickname: '',
        // 收件人姓名
        theRecipientName: '',
        // 推荐状态
        recommendedStatus: {
          id: 1
        },
        // 刀模具
        diePattern: null,
        // 磨具类型： id: 1 贴膜 id: 2 鼠标垫
        modelType: {
          id: 1
        },
        // 完成状态
        finishedCondition: {
          id: 1
        },
        // 定制状态
        customState: {
          id: 1
        },
        // 当前用户
        user: {
          id: -1
        }
      }
      // 重置鼠标垫配置
      state.sbd = {
        // 定制数量
        customQuantity: 1,
        // 淘宝ID
        taobaoNickname: '',
        // 收件人姓名
        theRecipientName: '',
        // 推荐状态
        recommendedStatus: {
          id: 1
        },
        // 磨具类型： id: 1 贴膜 id: 2 鼠标垫
        modelType: {
          id: 2
        },
        // 完成状态
        finishedCondition: {
          id: 1
        },
        // 定制状态
        customState: {
          id: 1
        },
        // 当前用户
        user: {
          id: -1
        }
      }
    },
    // 设置设计素材
    SET_FABRIC_DESIGN: (state, data) => {
      state.currentFabricDesign = data
    },
    SET_TEMPLATE_ID: (state, data) => {
      state.diePattern.id = data.diePattern.id
      state.diePattern.path = data.diePattern.diePatternimagePath
      // 根据按的类型来处里不同的模板
      if (state.currentType === 1) {
        state.customeTemplate = data
        state.currentCustomeTemplate = data
      } else {
        state.sbd = data
        state.currentCustomeTemplate = data
      }
    },
    SET_JSON_OF_FABRIC_DESIGN: (state, jsonStr) => {
      if (!state.currentFabricDesign.originJson) {
        state.currentFabricDesign.originJson = {}
      }
      state.currentFabricDesign.originJson = jsonStr
    }
  },
  actions: {
    /**
     * 获取`我要定制`列表
     */
    getBookingList ({ commit }, query) {
      return new Promise((resolve, reject) => {
        queryDiePatterns(query).then(response => {
          if (response.status !== 200) reject(new Error('error'))
          let data = response.data
          data.forEach(function
          (item, index, array) {
            item.customQuantity = 1
          })
          commit('SET_BOOKING_LIST', data || [])
          commit('SET_BOOKING_TOTAL', Number(response?.headers['x-total-count']) || 0)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取`鼠标垫信息`列表
     */
    getSbdInfo ({ commit }, query) {
      return new Promise((resolve, reject) => {
        queryDiePatterns(query).then(response => {
          if (response.status !== 200) reject(new Error('error'))
          commit('SET_SBD', response.data ? response.data[0] : {})
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取`我的定制`列表
     */
    getBookedList ({ commit, getters }, query) {
      return new Promise((resolve, reject) => {
        queryCustomTemplates(Object.assign(
          { login: getters.user.login },
          query
        )).then(response => {
          if (response.status !== 200) reject(new Error('error'))
          commit('SET_BOOKED_LIST', response.data ? response.data : [])
          commit('SET_BOOKED_TOTAL', Number(response?.headers['x-total-count']) || 0)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取`我的定制`列表
     */
    getMyAllBookedList ({ commit, getters }, query) {
      return new Promise((resolve, reject) => {
        queryAllCustomTemplates(getters.user.login, Object.assign(
          query
        )).then(response => {
          if (response.status !== 200) reject(new Error('error'))
          commit('SET_BOOKED_LIST', response.data ? response.data : [])
          commit('SET_BOOKED_TOTAL', Number(response?.headers['x-total-count']) || 0)
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 初始化磨具数据： 定制数量、淘宝ID、收件人姓名
     */
    initTemplateData ({ commit, state, getters }, prod) {
      const data = Object.assign({ user: getters.user }, prod)
      return new Promise((resolve) => {
        commit('INIT_TEMPLATE_DATA', data)
        resolve(state.customeTemplate.customNumber)
      })
    },
    /**
     * 保存自定义磨具
     */
    saveCustomTemplates ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // {"version":"3.0.0","objects":[{"type":"image","version":"3.0.0","originX":"left","originY":"top","left":0,"top":0,"width":2000,"height":4158,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":0,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.5,"scaleY":0.5,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"crossOrigin":"*","cropX":0,"cropY":0,"src":"http://th.minio.boyuanziben.cn/die-pattern/3f8b95cc-1da2-4993-97ea-b4b5e45c96b3.png","filters":[]},{"type":"text","version":"3.0.0","originX":"left","originY":"top","left":150,"top":10,"width":499,"height":45.2,"fill":"#ccc","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeMiterLimit":4,"scaleX":0.25,"scaleY":0.25,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","transformMatrix":null,"skewX":0,"skewY":0,"text":"淘宝ID：1    收件人姓名：2","fontSize":40,"fontWeight":"normal","fontFamily":"微软雅黑","fontStyle":"normal","lineHeight":1.16,"underline":false,"overline":false,"linethrough":false,"textAlign":"left","textBackgroundColor":"","charSpacing":0,"styles":{}}],"background":"#fff"}
        let bjbOrigin = {
          'version': '3.0.0',
          'objects': [{
            'name': 'diebg',
            'type': 'named-image',
            'version': '3.0.0',
            'originX': 'left',
            'originY': 'top',
            'left': 0,
            'top': 0,
            'width': 2000,
            'height': 4158,
            'fill': 'rgb(0,0,0)',
            'stroke': null,
            'strokeWidth': 0,
            'strokeDashArray': null,
            'strokeLineCap': 'butt',
            'strokeDashOffset': 0,
            'strokeLineJoin': 'miter',
            'strokeMiterLimit': 4,
            'scaleX': 0.5,
            'scaleY': 0.5,
            'angle': 0,
            'flipX': false,
            'flipY': false,
            'opacity': 1,
            'shadow': null,
            'visible': true,
            'clipTo': null,
            'backgroundColor': '',
            'fillRule': 'nonzero',
            'paintFirst': 'fill',
            'globalCompositeOperation': 'source-over',
            'transformMatrix': null,
            'skewX': 0,
            'skewY': 0,
            'crossOrigin': '*',
            'cropX': 0,
            'cropY': 0,
            'src': 'http://th.minio.boyuanziben.cn/' + state.customeTemplate.diePattern.diePatternimagePath,
            'filters': []
          }, {
            'type': 'named-text',
            'name': 'sjr',
            'version': '3.0.0',
            'originX': 'left',
            'originY': 'top',
            'left': 150,
            'top': 10,
            'width': 451,
            'height': 45.2,
            'fill': '#ccc',
            'stroke': null,
            'strokeWidth': 1,
            'strokeDashArray': null,
            'strokeLineCap': 'butt',
            'strokeDashOffset': 0,
            'strokeLineJoin': 'miter',
            'strokeMiterLimit': 4,
            'scaleX': 0.25,
            'scaleY': 0.25,
            'angle': 0,
            'flipX': false,
            'flipY': false,
            'opacity': 1,
            'shadow': null,
            'visible': true,
            'clipTo': null,
            'backgroundColor': '',
            'fillRule': 'nonzero',
            'paintFirst': 'fill',
            'globalCompositeOperation': 'source-over',
            'transformMatrix': null,
            'skewX': 0,
            'skewY': 0,
            'text': '淘宝ID：' + state.customeTemplate.taobaoNickname + '收件人姓名：' + state.customeTemplate.theRecipientName,
            'fontSize': 40,
            'fontWeight': 'normal',
            'fontFamily': '微软雅黑',
            'fontStyle': 'normal',
            'lineHeight': 1.16,
            'underline': false,
            'overline': false,
            'linethrough': false,
            'textAlign': 'left',
            'textBackgroundColor': '',
            'charSpacing': 0,
            'styles': {}
          }],
          'background': '#fff'
        }
        let sbdOrigin = {
          'version': '3.0.0',
          'objects': [{
            'name': 'diebg',
            'type': 'named-image',
            'version': '3.0.0',
            'originX': 'left',
            'originY': 'top',
            'left': 0,
            'top': 0,
            'width': 2000,
            'height': 4158,
            'fill': 'rgb(0,0,0)',
            'stroke': null,
            'strokeWidth': 0,
            'strokeDashArray': null,
            'strokeLineCap': 'butt',
            'strokeDashOffset': 0,
            'strokeLineJoin': 'miter',
            'strokeMiterLimit': 4,
            'scaleX': 0.5,
            'scaleY': 0.5,
            'angle': 0,
            'flipX': false,
            'flipY': false,
            'opacity': 1,
            'shadow': null,
            'visible': true,
            'clipTo': null,
            'backgroundColor': '',
            'fillRule': 'nonzero',
            'paintFirst': 'fill',
            'globalCompositeOperation': 'source-over',
            'transformMatrix': null,
            'skewX': 0,
            'skewY': 0,
            'crossOrigin': '*',
            'cropX': 0,
            'cropY': 0,
            'src': 'http://th.minio.boyuanziben.cn/' + state.sbd.diePattern.diePatternimagePath,
            'filters': []
          }, {
            'name': 'sjr',
            'type': 'named-text',
            'version': '3.0.0',
            'originX': 'left',
            'originY': 'top',
            'left': 150,
            'top': 10,
            'width': 451,
            'height': 45.2,
            'fill': '#ccc',
            'stroke': null,
            'strokeWidth': 1,
            'strokeDashArray': null,
            'strokeLineCap': 'butt',
            'strokeDashOffset': 0,
            'strokeLineJoin': 'miter',
            'strokeMiterLimit': 4,
            'scaleX': 0.25,
            'scaleY': 0.25,
            'angle': 0,
            'flipX': false,
            'flipY': false,
            'opacity': 1,
            'shadow': null,
            'visible': true,
            'clipTo': null,
            'backgroundColor': '',
            'fillRule': 'nonzero',
            'paintFirst': 'fill',
            'globalCompositeOperation': 'source-over',
            'transformMatrix': null,
            'skewX': 0,
            'skewY': 0,
            'text': '淘宝ID：' + state.customeTemplate.taobaoNickname + '收件人姓名：' + state.customeTemplate.theRecipientName,
            'fontSize': 40,
            'fontWeight': 'normal',
            'fontFamily': '微软雅黑',
            'fontStyle': 'normal',
            'lineHeight': 1.16,
            'underline': false,
            'overline': false,
            'linethrough': false,
            'textAlign': 'left',
            'textBackgroundColor': '',
            'charSpacing': 0,
            'styles': {}
          }],
          'background': '#fff'
        }
        const getBjbImg = new Promise((resolve, reject) => {
          // 图片
          const img = new Image()
          const src = 'http://th.minio.boyuanziben.cn/' + state.customeTemplate.diePattern.diePatternimagePath
          img.src = src
          img.onload = function () {
            resolve(img)
          }
        })
        const getSbdImg = new Promise((resolve, reject) => {
          // 图片
          const img = new Image()
          const src = 'http://th.minio.boyuanziben.cn/' + state.sbd.diePattern.diePatternimagePath
          img.src = src
          img.onload = function () {
            resolve(img)
          }
        })
        // 获取鼠标垫和笔记本的宽和高
        getBjbImg.then(response => {
          bjbOrigin.width = response.width
          bjbOrigin.height = response.height
          return getSbdImg
        }).then(response => {
          sbdOrigin.width = response.width
          sbdOrigin.height = response.height
          return Promise.all([saveCustomTemplates(state.customeTemplate), saveCustomTemplates(state.sbd)])
        }).then(response => {
          if (response[0].status !== 201) reject(new Error('saveCustomTemplates: error'))
          // 通过当前状态区分现在操作的是鼠标垫还是笔记本
          if (state.currentType === 1) {
            commit('SET_TEMPLATE_ID', response[0].data)
          } else {
            commit('SET_TEMPLATE_ID', response[1].data)
          }
          // 保存两个对应的素材信息，然后在设计界面直接加载该json信息即可，不论是继续设计还是新建，统一处理逻辑
          return Promise.all([saveFabricDesignMaterials({ originJson: JSON.stringify(bjbOrigin), customTemplate: response[0].data }), saveFabricDesignMaterials({ originJson: JSON.stringify(sbdOrigin), customTemplate: response[1].data })])
        }).then(response => {
          if (response[0].status !== 201) reject(new Error('saveCustomTemplates: error'))
          // 通过当前状态区分现在操作的是鼠标垫还是笔记本
          if (state.currentType === 1) {
            commit('SET_FABRIC_DESIGN', response[0].data)
          } else {
            commit('SET_FABRIC_DESIGN', response[1].data)
          }
          console.log(response)
          // 如果执行完则直接响应成功
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 更新自定义磨具
     */
    updateCustomTemplates ({ commit, state }, jsonStr) {
      return new Promise((resolve, reject) => {
        commit('SET_JSON_OF_FABRIC_DESIGN', jsonStr)
        updateFabricDesignMaterials(state.currentFabricDesign).then(response => {
          if (response.status !== 200) reject(new Error('updateCustomTemplates: error'))
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default home
