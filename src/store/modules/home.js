/**
 * 首页
 */

import { queryDiePatterns, queryCustomTemplates, saveCustomTemplates, queryAllCustomTemplates } from '@/api/home'
import { updateCustomTemplates } from '@/api/studio'
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
    // 鼠标垫
    sbd: {
      // 定制数量
      customQuantity: 0,
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
      } },
    customeTemplate: {
      // 定制编号
      customNumber: '',
      // 定制数量
      customQuantity: 0,
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
    SET_TEMPLATE_ID: (state, data) => {
      state.diePattern.id = data.diePattern.id
      // 根据按的类型来处里不同的模板
      // if (state.currentType === 1) {
      state.diePattern.path = data.diePattern.diePatternimagePath
      // } else {
      //  state.diePattern.path = state.sbdDiePattern.diePatternimagePath
      // }
    },
    SET_JSON_OF_TEMPLATE: (state, jsonStr) => {
      if (!state.customeTemplate.fabricDesignMaterials) {
        state.customeTemplate.fabricDesignMaterials = []
      }
      state.customeTemplate.fabricDesignMaterials.push({
        originJson: jsonStr
      })
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
          commit('SET_BOOKING_LIST', response.data ? response.data : [])
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
        Promise.all([saveCustomTemplates(state.customeTemplate), saveCustomTemplates(state.sbd)]).then(response => {
          if (response[0].status !== 201) reject(new Error('saveCustomTemplates: error'))
          // 通过当前状态区分现在操作的是鼠标垫还是笔记本
          if (state.currentType === 1) {
            commit('SET_TEMPLATE_ID', response[0].data)
          } else {
            commit('SET_TEMPLATE_ID', response[1].data)
          }
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
        commit('SET_JSON_OF_TEMPLATE', jsonStr)
        updateCustomTemplates(state.customeTemplate).then(response => {
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
