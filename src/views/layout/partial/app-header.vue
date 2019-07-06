<template>
  <mu-appbar
    :z-depth="2"
    class="header-wrapper"
    color="#535353"
  >
    <svg-icon icon-class="logo"/>
    <mu-button small flat slot="right"  @click="handleRedo">
      <mu-icon left value="cached"></mu-icon> 重做
    </mu-button>
    <mu-button small flat slot="right"  @click="handleSaveToRemote">
      <mu-icon left value="remove_red_eye"></mu-icon> 保存预览
    </mu-button>
    <mu-button small flat slot="right"  @click="handleSubmitDesignToRemote">
      <mu-icon left value="cloud_upload"></mu-icon> 提交设计
    </mu-button>
    <mu-button small flat slot="right"  @click="handleRefreshLayer">
      <mu-icon left value="refresh"></mu-icon> 刷新场景
    </mu-button>
    <mu-button v-if="isSbd" small flat slot="right" @click="goStudio(sbdCustomTemplate)">
      <mu-icon left value="mouse"></mu-icon> 设计鼠标垫
    </mu-button>
    <mu-button v-else-if="isBjb" small flat slot="right" @click="goStudio(bjbCustomTemplate)">
      <mu-icon left value="computer"></mu-icon> 设计贴膜
    </mu-button>
    <mu-button small flat slot="right"  @click="handleDownloadToLocal">
      <mu-icon left value="vertical_align_bottom"></mu-icon> 保存到本地
    </mu-button>
    <mu-button small flat slot="right"  @click="handleQuitEditor">
      <mu-icon left value="reply"></mu-icon> 退出编辑
    </mu-button>
    <mu-button small flat slot="right" color="#ff9800">
      欢迎您，{{ nickName }}
    </mu-button>
    <mu-menu slot="right" open-on-hover>
      <mu-button small flat>
        <mu-icon value="more_vert"></mu-icon>
      </mu-button>
      <mu-list slot="content">
        <mu-list-item button @click="loginOut">
          <mu-list-item-title>
            退出系统
          </mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-menu>
  </mu-appbar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import VarMixin from '@/mixins/var.js'
import LoadingMixin from '@/mixins/loading.js'
import ProgressMixin from '@/mixins/progress.js'
import ExtendObjectMixin from '@/mixins/extendObject.js'
import { uploadify } from '@/utils/file-upload.js'
import { download, parseTime } from '@/utils'
import { cloneDeep } from 'lodash'

export default {
  name: 'AppMain',
  mixins: [
    VarMixin,
    LoadingMixin,
    ProgressMixin,
    ExtendObjectMixin
  ],
  data () {
    return {
      canvasObject: null, // 画布对象
      uploading: false,
      layerActiveId: '' // 图层激活Id，用于设置样式
    }
  },
  computed: {
    ...mapGetters([
      'canvas',
      'dieLineBg',
      'nickName',
      'taobaoId',
      'recevier',
      'cacheSavedCustomTemplate',
      'sbdCustomTemplate',
      'bjbCustomTemplate',
      'tabActived'
    ]),
    isSbd () {
      return (
        parseInt(this.$route.query.type) === 1 &&
        this.sbdCustomTemplate.finishedCondition?.id === 1
      )
    },
    isBjb () {
      return (
        parseInt(this.$route.query.type) === 2 &&
        this.bjbCustomTemplate.finishedCondition?.id === 1
      )
    }
  },
  methods: {
    ...mapActions([
      'signOut',
      'setTabActived',
      'setOpenPreviewCanvasDialog',
      'clearLayers',
      'getCustomTemplateByCustomNumber',
      'saveOrUpdateFabricDesign',
      'updateCustomTemplates',
      'getFabricJsonById'
    ]),
    /**
     * 重做
     */
    handleRedo () {
      this.$confirm('确定要重做吗？', '提示', {
        type: 'warning'
      }).then(({ result }) => {
        if (result) {
          const c = this.canvas
          const objects = c.getObjects()
          objects.forEach((object) => {
            if (object.name === 'image' || object.name === 'itext') {
              c.remove(object)
            }
          })
          // 清空图层
          this.clearLayers()
          this.setTabActived(2)
          // this.navTabActived = 0
        }
      })
    },
    /**
     * 刷新场景
     */
    handleRefreshLayer () {
      const self = this
      const canvas = self.canvas
      self.bringDiebgAndWater()
      canvas.discardActiveObject(canvas.getActiveObject())
    },
    /**
     * 校验淘宝信息
     */
    validateInput (message, isContinue = false) {
      return new Promise((resolve, reject) => {
        if (!this.taobaoId || !this.recevier) {
          if (isContinue) {
            this.$toast.error({
              message: '淘宝ID或者收件人姓名不能为空',
              position: 'top'
            })
            this.setTabActived(2)
            // this.navTabActived = 3
            resolve(false)
          } else {
            this.$confirm('淘宝ID、或收件人姓名尚未填写，是否确认继续' + message + '？请再次确认！！！', '提示', {
              type: 'info'
            }).then(({ result }) => {
              resolve(result)
            }).catch(err => {
              reject(err)
            })
          }
        } else {
          resolve(true)
        }
      })
    },
    /**
     * 预览
     */
    previewCanvas () {
      return new Promise(resolve => {
        this.setOpenPreviewCanvasDialog(true)
      })
    },
    /**
     * 提取公共的保存信息
     */
    handleCustomTemplateAndFabricDesign (flag = true) {
      return new Promise((resolve, reject) => {
        // this.progressStart()
        this.progressStart()
        // 更新定制模版信息
        let customTemaplate = cloneDeep(this.bjbCustomTemplate)
        const sbd = cloneDeep(this.sbdCustomTemplate)
        // 淘宝id
        customTemaplate.taobaoNickname = this.taobaoId
        // 收件人姓名
        customTemaplate.theRecipientName = this.recevier
        sbd.taobaoNickname = this.taobaoId
        sbd.theRecipientName = this.recevier
        Promise.all([this.updateCustomTemplates(customTemaplate), this.updateCustomTemplates(sbd)]).then(response => {
          return this.saveOrUpdateFabricDesign(JSON.stringify(this.canvas.toJSON()))
        }).then(() => {
          // this.progressDone()
          this.progressDone()
          if (flag) {
            this.$toast.success({
              message: '保存成功',
              position: 'top'
            })
          }
          resolve()
        }).catch(err => {
          this.progressDone()
          this.$toast.error({
            message: err.response?.data?.detail,
            position: 'top'
          })
          reject(err)
        })
      })
    },
    /**
     * 保存到服务器
     */
    handleSaveToRemote () {
      if (this.dieLineBg) {
        this.canvas.remove(this.dieLineBg)
      }
      this.validateInput('保存并预览').then(result => {
        // 如果选择是确认，直接提交信息，否则的话打开信息面板
        if (result) {
          return this.handleCustomTemplateAndFabricDesign()
        } else {
          // this.navTabActived = 3
          this.setTabActived(2)
          throw new Error('BIG_ERROR')
        }
      }).then(response => {
        return this.previewCanvas()
      }).then(response => {
        // 什么都不用做
      })
    },
    /**
     * 提交设计到服务器
     */
    handleSubmitDesignToRemote () {
      if (this.dieLineBg) {
        this.canvas.remove(this.dieLineBg)
      }
      // 您真的要提交设计？一旦提交成功，将不能再修改，请再次确认！！！
      this.validateInput('提交设计', true).then(result => {
        return this.$confirm('您真的要提交设计？一旦提交成功，将不能再修改，请再次确认！！！', '提示', {
          type: 'info'
        })
      }).then(result => {
        // 如果选择是确认，直接提交信息，否则的话打开信息面板
        if (result) {
          this.progressStart()
          this.handleCustomTemplateAndFabricDesign(false).then(response => {
            // 上传图片到服务器
            return uploadify(this.canvas.toDataURL({
              format: 'png',
              multiplier: 4
            }), 'product-design')
          })
            .then(response => {
              this.uploading = false
              const { bucketName, fileName } = response
              this.productionRenderingImageUrl = `/${bucketName}/${fileName}`
              // 更新定制模版信息
              let customTemaplate = cloneDeep(this.cacheSavedCustomTemplate)
              // 设置完成状态为完成
              customTemaplate.finishedCondition.id = 2
              // 淘宝id
              customTemaplate.taobaoNickname = this.taobaoId
              // 收件人姓名
              customTemaplate.theRecipientName = this.recevier
              // 设置最终效果图
              customTemaplate.productionRenderingImageUrl = this.productionRenderingImageUrl
              return this.updateCustomTemplates(customTemaplate)
            }).then(response => {
              return this.saveOrUpdateFabricDesign(JSON.stringify(this.canvas.toJSON()))
            }).then(() => {
              this.progressDone()
              this.$toast.success({
                message: '提交成功',
                position: 'top'
              })
              this.$router.push({ path: '/' })
            }).catch(err => {
              this.uploading = false
              this.progressDone()
              this.$toast.error({
                message: err.response?.data?.detail,
                position: 'top'
              })
            })
        }
      })
    },
    goStudio (customTemaplate) {
      // 清空画板
      this.canvas.clear()
      // 清空图层
      this.clearLayers()
      this.$router.push({
        name: 'studio',
        query: { id: customTemaplate.id, type: customTemaplate.modelType.id, bh: customTemaplate.customNumber }
      })
    },
    /**
     * 保存到本地
     */
    handleDownloadToLocal () {
      if (this.dieLineBg) {
        this.canvas.remove(this.dieLineBg)
      }
      // 如果收件人或者淘宝id为空不允许提交
      if (!this.taobaoId || !this.recevier) {
        this.$toast.error({
          message: '淘宝ID或者收件人姓名不能为空',
          position: 'top'
        })
        this.setTabActived(2)
        return
      }
      // 调整文件命名规则
      let id = (this.taobaoId) + '-' + (this.recevier) + '-' + this.cacheSavedCustomTemplate.diePattern.computerType.value + '-' + this.cacheSavedCustomTemplate.diePattern.diePatternType + '-' + this.cacheSavedCustomTemplate.modelType.value + '-' + parseTime(this.cacheSavedCustomTemplate.createdDate, '{y}-{m}-{d} {h}:{i}:{s}')
      this.$confirm('您真的要将设计保存到本地？一旦点击确定，将不能再修改，请再次确认！！！', '重要提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.progressStart()
          this.handleCustomTemplateAndFabricDesign(false).then(response => {
            // 上传图片到服务器
            return uploadify(this.canvas.toDataURL({
              format: 'png',
              multiplier: 4
            }), 'product-design')
          })
            .then(response => {
              this.uploading = false
              const { bucketName, fileName } = response
              this.productionRenderingImageUrl = `/${bucketName}/${fileName}`
              // 更新定制模版信息
              let customTemaplate = cloneDeep(this.cacheSavedCustomTemplate)
              // 设置完成状态为完成
              customTemaplate.finishedCondition.id = 2
              // 淘宝id
              customTemaplate.taobaoNickname = this.taobaoId
              // 收件人姓名
              customTemaplate.theRecipientName = this.recevier
              // 设置最终效果图
              customTemaplate.productionRenderingImageUrl = this.productionRenderingImageUrl
              return this.updateCustomTemplates(customTemaplate)
            }).then(response => {
              return this.saveOrUpdateFabricDesign(JSON.stringify(this.canvas.toJSON()))
            }).then(() => {
              this.progressDone()
              this.$toast.success({
                message: '保存本地成功',
                position: 'top'
              })
              download(this.canvas.toDataURL({
                format: 'png',
                multiplier: 4
              }), id + '.png')
              // if (this.isSbd()) {
              //   this.goStudio(this.sbdCustomTemplate)
              // } else if (this.isBjb()) {
              //   this.goStudio(this.sbdCustomTemplate)
              // }
              // this.$router.push({ path: '/' })
            }).catch(err => {
              this.uploading = false
              this.progressDone()
              this.$toast.error({
                message: err.response?.data?.detail,
                position: 'top'
              })
            })
        }
      })
    },
    /**
     * 退出编辑
     */
    handleQuitEditor () {
      this.$confirm('您是否已经保存设计？您真的要退出编辑？请再次确认！！！', '重要提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.clearLayers()
          this.$router.push({ path: '/' })
        }
      })
    },
    /**
     * 退出系统
     */
    loginOut () {
      this.$confirm('确定要退出系统吗？', '提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.signOut().then(() => {
            this.clearLayers()
            this.$router.push({ path: '/login' })
          })
        }
      })
    }
  }
}
</script>
