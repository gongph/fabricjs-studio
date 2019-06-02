<template>
  <div class="app-container home-page">
    <mu-appbar :z-depth="2" class="mu-appbar-header is-open is-only-title" color="primary">
      <svg-icon icon-class="logo" class-name="logo"/>
      <span class="logo-cn">新通路贴膜定制系统</span>
      <mu-button flat slot="right">欢迎您，{{ nickName }}</mu-button>
      <mu-menu slot="right" :open.sync="isOpenMenu" open-on-hover>
        <mu-button flat>
          <mu-icon value="more_vert"></mu-icon>
        </mu-button>
        <mu-list slot="content">
          <mu-list-item button @click="openAlertDialog">
            <mu-list-item-title>修改密码</mu-list-item-title>
          </mu-list-item>
          <mu-list-item button @click="loginOut">
            <mu-list-item-title>退出系统</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-menu>
    </mu-appbar>

    <div class="main-container">
      <div class="carousel-wrapper">
        <!-- 轮播图 -->
        <mu-carousel hide-controls hide-indicators transition="fade" :interval="60000">
          <mu-carousel-item>
            <img src="/img/banner-01.jpg">
          </mu-carousel-item>
          <mu-carousel-item>
            <img src="/img/banner-02.jpg">
          </mu-carousel-item>
          <mu-carousel-item>
            <img src="/img/banner-03.jpg">
          </mu-carousel-item>
          <mu-carousel-item>
            <img src="/img/banner-04.jpg">
          </mu-carousel-item>
        </mu-carousel>
        <!-- 搜索 -->
        <div class="search-wrapper">
          <div class="search-wrapper__inner">
            <!-- 搜索框 -->
            <mu-text-field
              v-model="listQuery.queryParams"
              color="#ffffff"
              class="mu-site-search"
              :key="fieldKey"
              :class="isFocus ? 'mu-input__focus' : ''"
              :placeholder="placeholder"
              @focus="handleSearchFocus"
              @key.enter="search"
              solo
            >
              <template #append>
                <mu-icon class="search-button" value="search" @click="search"></mu-icon>
              </template>
            </mu-text-field>
          </div>
          <!-- 提示语 -->
          <div class="tips-wrapper">
            {{ tips }}
          </div>
        </div>
      </div>
      <mu-container fluid>
        <mu-tabs
          :value.sync="tabActive"
          @change="handleTabChange"
          indicator-color="orange"
          color="orange"
          center
          inverse
        >
          <mu-tab>我要定制</mu-tab>
          <mu-tab>我的定制</mu-tab>
        </mu-tabs>
        <!-- 我要定制 -->
        <div class="marking-wrapper" v-if="tabActive === 0">
          <mu-data-table height="300" :columns="columns" :data="bookingList" :loading="markingTableLoading">
            <template slot-scope="scope">
              <td class="is-center">{{scope.row.computerType.value}}</td>
              <td class="is-center">{{scope.row.diePatternType}}</td>
              <td class="is-center">
                <mu-text-field
                  type="number"
                  v-model.number="scope.row.customQuantity"
                  solo
                />
              </td>
              <td class="is-center">
                <mu-text-field
                  v-model.trim="scope.row.taobaoNickname"
                  placeholder="输入淘宝ID(可留空)"
                  solo
                />
              </td>
              <td class="is-center">
                <mu-text-field
                  v-model.trim="scope.row.theRecipientName"
                  placeholder="输入收件人姓名(可留空)"
                  solo
                />
              </td>
              <td class="is-center">
                <mu-button
                  href="javascript:;"
                  small
                  color="#1565c0"
                  @click="submitMarkingForm(1, scope.row)"
                  :ripple="false"
                >
                  定制贴膜
                </mu-button>
                <mu-button
                  href="javascript:;"
                  small
                  color="indigo400"
                  @click="submitMarkingForm(2, scope.row)"
                  style="margin-left: 5px"
                  :ripple="false"
                >
                  定制鼠标垫
                </mu-button>
              </td>
            </template>
          </mu-data-table>
          <!-- 分页 -->
          <template v-if="bookingList.length > 0">
            <mu-flex justify-content="center" class="mu-search-pagination">
              <mu-pagination
                :total="bookingTotal"
                :current.sync="listQuery.page + 1"
                :page-size="listQuery.size"
                @change="handlePagingChange"
                raised
                circle
              />
            </mu-flex>
          </template>
        </div>
        <!-- 我的定制 -->
        <div class="marked-wrapping" v-if="tabActive === 1">
          <mu-data-table stripe class="mu-marked-table" height="300" :columns="columns2" :data="bookedList" :loading="markedTableLoading">
              <template slot-scope="scope">
              <td class="is-center">{{ scope.row.customNumber }}</td>
              <td class="is-center">
                <span v-if="scope.row.diePattern && scope.row.diePattern.computerType && scope.row.diePattern.computerType.value">{{ scope.row.diePattern.computerType.value }}</span>
                <span v-else> 这个是错误数据啊，联系管理员删除该数据 </span>
              <td class="is-center">
                <span v-if="scope.row.diePattern && scope.row.diePattern.diePatternType">{{ scope.row.diePattern.diePatternType }}</span>
                <span v-else> 这个是错误数据啊，联系管理员删除该数据 </span>
              </td>
              <td class="is-center">{{ scope.row.customQuantity }}</td>
              <td class="is-center">{{ scope.row.taobaoNickname }}</td>
              <td class="is-center">{{ scope.row.theRecipientName }}</td>
              <td class="is-center">{{ scope.row.modelType.value }}</td>
              <td class="is-center">
                <span v-if="scope.row.finishedCondition.id === 1" style="color: red">{{ scope.row.finishedCondition.value }}</span>
                <span v-else>{{ scope.row.finishedCondition.value }}</span>
              </td>
              <td class="is-center">{{ scope.row.customState.value }}</td>
              <td class="is-center"><span>{{ scope.row.createdDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span></td>
              <td class="is-center">
                <mu-tooltip placement="top" v-if="scope.row.finishedCondition.id === 1" content="继续定制">
                  <mu-button icon color="error" @click="goStudio(scope.row.modelType.id, scope.row)">
                    <mu-icon value="computer" v-if="scope.row.modelType.id === 1"></mu-icon>
                    <mu-icon v-else value="mouse"></mu-icon>
                  </mu-button>
                </mu-tooltip>
              </td>
            </template>
          </mu-data-table>
          <!-- 分页 -->
          <template v-if="bookedList.length > 0">
            <mu-flex justify-content="center" class="mu-search-pagination">
              <mu-pagination
                raised
                circle
                :total="bookedTotal"
                :current.sync="listQuery.page + 1"
                :page-size="listQuery.size"
                @change="handlePagingChange"
              />
            </mu-flex>
          </template>
        </div>
      </mu-container>
    </div>

    <!-- 修改密码弹框 -->
    <mu-dialog
      class="mu-alert-dialog"
      title="修改密码"
      width="330"
      overlay-color="#fff"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="openAlert"
    >
      <mu-form ref="form" :model="form">
        <mu-text-field
          v-model.trim="form.currentPassword"
          label="输入当前密码"
          icon="locked"
          :error-text="oldpwdMessage"
          label-float
        />
        <mu-text-field
          v-model.trim="form.newPassword"
          label="输入新密码"
          icon="locked"
          :error-text="newpwdMessage"
          label-float
        />
      </mu-form>
      <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">取消</mu-button>
      <mu-button
        slot="actions"
        flat
        color="info"
        @click="submitChangePwdForm"
        v-loading="loading"
        data-mu-loading-size="24"
        :disabled="loading"
      >
        确定
      </mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { parseTime } from '@/utils'
import { throttle } from 'lodash'
export default {
  name: 'HomePage',
  data () {
    return {
      tabActive: 0,
      isOpenMenu: false,
      isFocus: false,
      listQuery: {
        page: 0,
        size: 10,
        queryParams: ''
      },
      fieldKey: 'marking',
      placeholder: '笔记本的品牌、型号',
      tips: '输入定制的电脑型号，点击"搜索图标"，在检索结果中找相应型号后点击"开始定制"',
      columns: [
        { title: '笔记本品牌', width: 130, name: 'computerType', sortable: true },
        { title: '笔记本型号', name: 'computerMode', align: 'center', sortable: true },
        { title: '定制数量', name: 'customQuantity', align: 'center', sortable: true },
        { title: '淘宝ID', name: 'taobaoNickname', align: 'center', sortable: true },
        { title: '收件人姓名', name: 'theRecipientName', align: 'center', sortable: true },
        { title: '功能', name: 'actions', align: 'center', width: 270 }
      ],
      columns2: [
        { title: '定制编号', name: 'customNumber', sortable: true, width: 220 },
        { title: '品牌', name: 'computerType', align: 'center', sortable: true, width: 80 },
        { title: '型号', name: 'computerMode', align: 'center', sortable: true },
        { title: '数量', name: 'customQuantity', align: 'center', sortable: true, width: 80 },
        { title: '淘宝ID', name: 'taobaoNickname', align: 'center', sortable: true },
        { title: '收件人姓名', name: 'theRecipientName', align: 'center' },
        { title: '定制类型', name: 'modelType', align: 'center' },
        { title: '完成状态', name: 'finishedCondition', align: 'center' },
        { title: '定制进度', name: 'customState', align: 'center' },
        { title: '定制日期', name: 'createdDate', align: 'center' },
        { title: '功能', name: 'actions', align: 'center' }
      ],
      markingTableLoading: false,
      markedTableLoading: false,
      openAlert: false,
      oldpwdMessage: '',
      newpwdMessage: '',
      form: {
        currentPassword: '',
        newPassword: ''
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'nickName',
      'bookingList',
      'bookingTotal',
      'bookedList',
      'bookedTotal'
    ])
  },
  created () {
    // 第一件事情初始化鼠标垫，鼠标垫从刀模图中获取一个
    this.getSbdInfo({ query: '鼠标垫' })
    this.$nextTick(() => {
      document.querySelector('.carousel-wrapper').onclick = (evt) => {
        if (evt.target.tagName === 'IMG') {
          this.isFocus = false
        }
      }
    })
  },
  filters: {
    parseTime: function (value) {
      if (!value) return ''
      value = value.toString()
      return parseTime(value)
    }
  },
  methods: {
    ...mapActions([
      'signOut',
      'getSbdInfo',
      'changePassword',
      'getBookingList',
      'getBookedList',
      'getMyAllBookedList',
      'initTemplateData'
    ]),
    /**
     * 退出系统
     */
    loginOut () {
      this.signOut().then(() => {
        this.$router.push({ path: '/login' })
      })
    },
    openAlertDialog () {
      this.openAlert = true
    },
    closeAlertDialog () {
      this.openAlert = false
      this.clear()
    },
    goStudio (type, row) {
      this.$store.commit('SET_CURRENT_TYPE', type)
      this.$store.commit('SET_TEMPLATE_ID', row)

      this.$router.push({
        name: 'studio',
        query: row.id
      })
    },
    /**
     * 查询
     */
    search () {
      if (this.fieldKey === 'marked' && !this.listQuery.queryParams) {
        this.getMyBookedListWithoutSearch()
        return
      }
      if (!this.listQuery.queryParams) {
        this.$toast.info({
          message: '搜索内容不能为空',
          position: 'top'
        })
      } else {
        // 我要定制
        if (this.fieldKey === 'marking') {
          this.markingTableLoading = true
          this.getBookingList({
            page: this.listQuery.page,
            size: this.listQuery.size,
            query: this.listQuery.queryParams
          }).then(() => {
            this.markingTableLoading = false
          })
        } else if (this.fieldKey === 'marked') {
          this.getMyBookedList()
        }
      }
    },
    /**
     * 获取没有搜索关键字的列表
     */
    getMyBookedListWithoutSearch () {
      this.markedTableLoading = true
      this.getMyAllBookedList({
        page: this.listQuery.page,
        size: this.listQuery.size
      }).then(() => {
        this.markedTableLoading = false
      })
    },
    /**
     * 获取有搜索关键字的列表
     */
    getMyBookedList () {
      this.markedTableLoading = true
      this.getBookedList({
        page: this.listQuery.page,
        size: this.listQuery.size,
        query: this.listQuery.queryParams
      }).then(() => {
        this.markedTableLoading = false
      })
    },
    /**
     * 提交`我要定制`表单
     */
    submitMarkingForm (type, row) {
      // 设置当前操作的类型，笔记本1，鼠标垫2
      this.$store.commit('SET_CURRENT_TYPE', type)
      this.initTemplateData(row).then((id) => {
        this.$router.push({
          name: 'studio',
          query: {
            id
          }
        })
      })
    },
    /**
     * 修改密码
     */
    submitChangePwdForm: throttle(function () {
      this.validate(valid => {
        if (valid) {
          this.loading = true
          this.$progress.start()
          this.changePassword(this.form).then(response => {
            this.$progress.done()
            this.$toast.success({
              message: '修改密码成功',
              position: 'top'
            })
            this.loading = false
            this.openAlert = false
            this.clear()
          }).catch(err => {
            const status = err.response?.data?.status
            let errorMsg = ''
            if (status === 400) {
              errorMsg = '您输入的当前密码无效'
            }
            this.$toast.error({
              message: errorMsg,
              position: 'top'
            })
            this.$progress.done()
            this.loading = false
          })
        } else {
          return false
        }
      })
    }, 1000),
    /**
     * 重置修改密码表单
     */
    clear () {
      this.$refs.form.clear()
      this.form = {
        currentPassword: '',
        newPassword: ''
      }
    },
    /**
     * 验证修改密码表单
     */
    validate (callback) {
      const message = '密码长度大于3小于10'
      const oldVal = this.form.currentPassword
      const newVal = this.form.newPassword
      let valid = false
      if (!oldVal) {
        this.oldpwdMessage = '请输入旧密码'
        valid = false
      } else {
        if (oldVal.length < 3 || oldVal.length > 10) {
          this.oldpwdMessage = message
          valid = false
        } else {
          this.oldpwdMessage = ''
          valid = true
        }
      }
      if (!newVal) {
        this.newpwdMessage = '请输入新密码'
        valid = false
      } else {
        if (newVal.length < 3 || newVal.length > 10) {
          this.newpwdMessage = message
          valid = false
        } else {
          this.newpwdMessage = ''
          valid = true
        }
      }
      callback(valid)
    },
    /**
     * 处理标签页改变
     */
    handleTabChange (index) {
      if (index === 0) {
        this.listQuery.queryParams = ''
        this.fieldKey = 'marking'
        this.placeholder = '笔记本的品牌、型号'
        this.tips = '输入定制的电脑型号，点击"搜索"图标，在检索结果中找相应型号后点击"开始定制"'
      } else {
        this.listQuery.queryParams = ''
        this.fieldKey = 'marked'
        this.placeholder = '定制编号、淘宝ID、收件人姓名'
        this.tips = '输入要查询的淘宝ID或收件人姓名，并点击"搜索"图标'
        this.getMyBookedListWithoutSearch()
      }
    },
    /**
     * 处理分页改变
     */
    handlePagingChange (page) {
      this.listQuery.page = page - 1
      this.search()
    },
    /**
     * 处理搜索框聚焦
     */
    handleSearchFocus () {
      this.isFocus = true
    }
  }
}
</script>

<style lang="scss" scoped>
.carousel-wrapper {
  position: relative;
  user-select: none;
  .mu-carousel {
    height: 300px;
    // border-radius: 0 0 80% 80%;
  }
  .search-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .search-wrapper__inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .tips-wrapper {
    position: absolute;
    bottom: 30%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
  }
}
</style>
