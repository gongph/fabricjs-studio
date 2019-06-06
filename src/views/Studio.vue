<template>
  <div class="studio-page">
    <!-- 侧边栏 -->
    <mu-paper class="mu-app-drawer mu-drawer is-open" v-if="!loading">
      <mu-tabs
        :value.sync="navTabActived"
        class="mu-elevation-2"
        color="primary"
        indicator-color="orange"
        full-width
      >
        <mu-tab><mu-icon value="view_quilt"></mu-icon>基础</mu-tab>
        <mu-tab :disabled="attrTababled"><mu-icon value="storage"></mu-icon>属性</mu-tab>
        <mu-tab><mu-icon value="layers"></mu-icon>图层</mu-tab>
        <mu-tab><mu-icon value="loyalty"></mu-icon>信息</mu-tab>
      </mu-tabs>
      <div class="sidebar-base-content" v-if="navTabActived === 0">
        <sidebar-base @click="handleMenuClick"/>
      </div>
      <div class="sidebar-attrs-content" v-if="navTabActived === 1">
        <sidebar-attrs
          :graph-type="graphType"
          :disabled="disabled"
          @graph:copyed="handleGraphCopyed"
        />
      </div>
      <div class="sidebar-layer-content" v-if="navTabActived === 2">
        <sidebar-layer
          :active-id.sync="layerActiveId"
          @layer:visibled="handleLayerVisibled"
          @layer:selected="handleLayerSelected"
          @layer:removed="handleLayerRemoved"
        />
      </div>
      <div class="sidebar-infos-content" v-if="navTabActived === 3">
        <sidebar-infos @info:changed="handleInfoChanged"/>
      </div>
    </mu-paper>
    <!-- 头部菜单 -->
    <mu-appbar :z-depth="2" class="mu-appbar-header is-open is-only-title" color="primary" v-if="!loading">
      <svg-icon icon-class="logo"/>
      <span class="logo-cn">新通路贴膜定制系统</span>
      <mu-button small flat slot="right" @click="handleRedo">
        <mu-icon left value="cached"></mu-icon> 重做
      </mu-button>
      <mu-button small flat slot="right" @click="previewCanvas">
        <mu-icon left value="remove_red_eye"></mu-icon> 预览
      </mu-button>
      <mu-button small flat slot="right" @click="handleSaveToRemote">
        <mu-icon left value="cloud_upload"></mu-icon> 提交
      </mu-button>
      <mu-button small flat slot="right" @click="handleDownloadToLocal">
        <mu-icon left value="vertical_align_bottom"></mu-icon> 保存到本地
      </mu-button>
      <mu-button small flat slot="right" @click="handleQuitEditor">
        <mu-icon left value="reply"></mu-icon> 退出编辑
      </mu-button>
      <mu-button small flat slot="right" color="orange">
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

    <!-- 画布 -->
    <main class="canvas-layout">
      <div id="canvas-wrapper" class="canvas-wrapper">
        <canvas id="canvas"></canvas>
      </div>
    </main>

    <!-- 上传图片弹框 -->
    <mu-dialog
      width="640"
      title="添加图片"
      dialog-class="mu-uploadify-dialog"
      :overlay-opacity="0.5"
      :open.sync="openUploadImgDialog"
      :overlay-close="false"
    >
      <mu-tabs
        :value.sync="uploadTabActived"
        inverse
        text-color="rgba(0, 0, 0, .54)"
        color="orange"
        indicator-color="orange"
        @change="handleDialogTabChange"
      >
        <mu-tab>本地图片</mu-tab>
        <mu-tab>官方图库</mu-tab>
      </mu-tabs>
      <div class="image local-img" v-if="uploadTabActived === 0">
        <div class="image-upload__wrapper">
          <div
            class="image-upload"
            :style="localUploadUrl ? 'background: url(' + localUploadUrl + ') no-repeat center center;' : 'dd'"
          >
            <mu-icon value="cloud_upload" class="cloud_upload"></mu-icon>
            <p>只能上传jpg/png图片，建议上传高清壁纸</p>
            <input type="file" id="file-upload" class="file-upload" @change="handleUploadChange">
          </div>
        </div>
      </div>
      <div class="image remote-img" v-if="uploadTabActived === 1">
        <div class="image-types">
          <mu-button
            href="javascript:;"
            small
            flat
            @click="getImageTypes()"
            :class="!imageTypeId ? 'active' : ''"
          >
            全部
          </mu-button>
          <mu-button
            v-for="(type, $index) of galleryTypes"
            href="javascript:;"
            :class="imageTypeId === type.id ? 'active' : ''"
            :key="$index"
            @click="getImageTypes(type.id)"
            small
            flat
          >
            {{ type.name }}
          </mu-button>
        </div>
        <mu-divider></mu-divider>
        <div class="image-list">
          <div class="image-list__inner">
            <div
              v-for="(img, $index) of gallerys"
              class="item"
              :key="$index"
              :class="selectedImgId == img.id ? 'active' : ''"
            >
              <div class="superscript">
                <svg-icon icon-class="superscript"/>
              </div>
              <image-lazyload
                :src="baseImgUrl + img.imgeUrl"
                class="item-img"
                :data-id="img.id"
                @click="handleImgClick"
              />
            </div>
          </div>
        </div>
      </div>
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="openUploadImgDialog = false"
      >
        取消
      </mu-button>
      <template v-if="uploadTabActived === 0">
        <mu-button
          slot="actions"
          flat
          color="info"
          @click="uploadLocalImgToCanvas"
        >
          上传
        </mu-button>
      </template>
      <template v-else>
        <mu-button
          slot="actions"
          flat
          color="info"
          v-loading="sureBtnLoading"
          data-mu-loading-size="24"
          @click="handleImgSelected"
        >
          确定
      </mu-button>
      </template>
    </mu-dialog>

    <!-- 预览画布效果 -->
    <preview-canvas v-if="openPreivewCanvasDialog" :open.sync="openPreivewCanvasDialog"/>

  </div>
</template>

<script>
import { SidebarBase, SidebarAttrs, SidebarLayer, SidebarInfos } from './layout'
import { mapGetters, mapActions } from 'vuex'
import { baseImgUrl, gererateUUID, download, getUrlParam } from '@/utils'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
// import { uploadify } from '@/utils/file-upload.js'
import fb from '@/utils/fabric'
import ImageLazyload from '@/components/ImgLazyload/index.vue'
import PreviewCanvas from './components/preview-canvas.vue'

export default {
  name: 'Studio',
  components: {
    SidebarBase,
    SidebarAttrs,
    SidebarLayer,
    SidebarInfos,
    ImageLazyload,
    PreviewCanvas
  },
  data () {
    return {
      baseImgUrl,
      navTabActived: 0,
      uploadTabActived: 0,
      attrTababled: true,
      canvas: null,
      openUploadImgDialog: false,
      graphType: 'itext',
      disabled: true,
      globalLoading: true,
      sureBtnLoading: false,
      imageTypeId: '',
      // 当前选择的图片对象
      selectedImg: null,
      // 当前选择的图片id
      selectedImgId: -1,
      openPreivewCanvasDialog: false,
      loading: true,
      // 图层激活Id，用于设置样式
      layerActiveId: '',
      // 本地上传的图片base64
      localUploadUrl: '',
      scrollTop: 100,
      // 是否创建过
      fabricDesign: null,
      // 水印对象
      waterText: null,
      // 淘宝Id
      taobaoId: this.taobaoNickname,
      // 收件人姓名
      recevier: this.theRecipientName
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 检查浏览器中是否有 id。没有说明是非法URL跳转到首页
      if (!getUrlParam('id')) {
        vm.$router.push({ path: '/' })
      }
    })
  },
  created () {
    this.taobaoId = this.taobaoNickname
    this.recevier = this.theRecipientName
  },
  mounted () {
    this.initFabric()
    // 初始化滚动事件
    fromEvent(
      document.querySelector('.canvas-layout'),
      'scroll'
    ).pipe(
      debounceTime(250)
    ).subscribe(evt => {
      this.scrollTop = evt.target.scrollTop
    })
  },
  computed: {
    ...mapGetters([
      'nickName',
      'activeObject',
      'cacheDiePatternPath',
      'cacheCustomNumber',
      'cacheSavedCustomTemplate',
      'cacheModelType',
      'galleryTypes',
      'gallerys',
      'taobaoNickname',
      'theRecipientName'
    ])
  },
  methods: {
    ...mapActions([
      'signOut',
      'setCanvas',
      'setActiveObject',
      'delActiveObject',
      'getGalleryTypes',
      'getGalleryByTypeId',
      'pushLayer',
      'clearLayers',
      'saveOrUpdateFabricDesign',
      'getFabricJsonById'
    ]),
    /**
     * 从 JOSN 中加载
     */
    loadFromJSON (canvas, json) {
      const self = this
      canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
        // 修复 toJSON 时 name 过滤掉的问题
        if (object.type === 'image') {
          if (object.name === 'diebg') {
            // 模具背景
            object.set({
              _uuid: -1,
              name: 'diebg',
              selectable: false,
              evented: false,
              moveCursor: 'default',
              hoverCursor: 'default'
            })
          } else if (object.name === 'image') {
            // 图片
            object.set({
              name: 'image',
              _uuid: gererateUUID()
            })
            self.pushLayer({
              name: object.name,
              id: object._uuid,
              visible: true
            })
          }
        } else if (object.type === 'i-text') {
          // 可编辑文字
          object.set({
            name: 'itext',
            _uuid: gererateUUID()
          })
          self.pushLayer({
            name: object.name,
            id: object._uuid,
            visible: true
          })
        } else if (object.type === 'text') {
          // 水印文字
          object.set({
            name: 'waterText',
            _uuid: -1,
            evented: false,
            selectable: false
          })
          self.waterText = object
        }

        object.toObject = (function (toObject) {
          return function () {
            return self.$fabric.util.object.extend(toObject.call(this), {
              name: this.name,
              _uuid: this._uuid
            })
          }
        })(object.toObject)

      })
    },
    /**
     * 创建Fabric
     */
    createFabric (canvas) {
      const self = this
      self.$fabric.Image.fromURL(
        `${baseImgUrl}${self.cacheDiePatternPath}`,
        (oImg) => {
          oImg.scale(0.5)
          oImg.set({
            selectable: false,
            evented: false,
            moveCursor: 'default',
            hoverCursor: 'default'
          })
          oImg = self.extendObject(oImg, 'diebg', false) // 拓展字段
          canvas.add(oImg)
          self.initWatermark() // 初始化水印
        }, {
          crossOrigin: 'Anonymous'
        }
      )
    },
    // 初始化 Canvas
    initCanvas (callback) {
      const self = this
      const image = new Image()
      image.src = `${baseImgUrl}${self.cacheDiePatternPath}`
      image.onload = () => {
        // 初始化Canvas画布
        const canvas = self.canvas = fb.init(
          document.getElementById('canvas'),
          {
            name: 'canvas',
            backgroundColor: '#fff',
            width: image.width / 2,
            height: image.height / 2,
            stopContextMenu: true,
            backgroundVpt: false
          }
        )
        callback(canvas)
      }
    },
    /**
     * 全局Loading
     */
    handleLoading (opts) {
      var opts = opts || {
        overlayColor: '#303030',
        color: 'orange',
        className: 'mu-custom-loading',
        text: '正在为您准备画布，请稍等...'
      }
      return this.$loading(opts)
    },
    /**
     * 初始化Fabric
     */
    initFabric () {
      const self = this
      this.$progress.start()
      const loading = this.handleLoading()
      // 获取服务器上保存的 json 文件
      this.getFabricJsonById(this.$route.query.id).then(data => {
        let originJson = null
        if (data) {
          this.fabricDesign = data
          originJson = data.originJson
        }
        this.initCanvas((canvas) => {
          if (!originJson) {
            self.createFabric(canvas)
          } else {
            self.loadFromJSON(canvas, originJson)
          }
          self.setCanvas(canvas)
          // 初始化选中样式
          self.initCornerStyle()
          // 初始化事件
          self.initEvents()
          setTimeout(() => {
            self.$progress.done()
            loading.close()
            self.loading = false
          }, 250)
        })
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * 初始化转角样式
     */
    initCornerStyle () {
      this.$fabric.Object.prototype.transparentCorners = false
      this.$fabric.Object.prototype.borderColor = '#409EFF'
      this.$fabric.Object.prototype.borderDashArray = [3, 3]
      this.$fabric.Object.prototype.cornerColor = '#409EFF'
      this.$fabric.Object.prototype.cornerSize = 6
      this.$fabric.Object.prototype.rotatingPointOffset = 20
    },
    /**
     * 初始化事件
     */
    initEvents () {
      const self = this
      const canvas = this.canvas
      fromEvent(canvas, 'mouse:down').pipe(debounceTime(100)).subscribe(opt => {
        let target = opt.target
        if (target && !target.name) {
          const name = target.type === 'image' ? 'image' : 'itext'
          target = self.extendObject(target, name)
        }
        if (target) {
          self.layerActiveId = target._uuid
          self.setActiveObject(opt.target)
          self.graphType = target.name
          self.attrTababled = false
          self.disabled = false
          self.navTabActived = 1
        } else {
          self.delActiveObject()
          self.disabled = true
        }
      })
    },
    extendObject (target, name, ispush = true) {
      const self = this
      target.set({
        name,
        _uuid: gererateUUID()
      })
      // 是否推送到图层
      if (ispush) {
        this.pushLayer({
          name: target.name,
          id: target._uuid,
          visible: true
        })
      }
      target.toObject = (function (toObject) {
        return function () {
          return self.$fabric.util.object.extend(toObject.call(this), {
            name: this.name,
            _uuid: this._uuid
          })
        }
      })(target.toObject)
      return target
    },
    /**
     * 添加水印。淘宝ID和收件人姓名
     */
    initWatermark (opt = { left: 150, top: 10 }) {
      const self = this
      if (!this.cacheModelType) return
      const waterStr = `淘宝ID：${this.taobaoId}    收件人姓名：${this.recevier}`
      let waterText = self.waterText = fb.addText(waterStr, {
        fontFamily: 'Microsoft YaHei',
        fill: '#fff',
        evented: false,
        selectable: false
      })
      if (this.cacheModelType === 1) {
        waterText.scale(0.25)
        waterText.set({
          left: opt.left,
          top: opt.top
        })
      } else {
        waterText.scale(0.35)
        waterText.set({
          left: 20,
          top: 10,
          angle: 90
        })
      }
      // 拓展字段
      waterText = self.extendObject(waterText, 'waterText', false)
      this.canvas.add(waterText)
    },
    handleWatermark () {
      if (!this.waterText) return
      this.waterText.set({
        text: `淘宝ID：${this.taobaoId}    收件人姓名：${this.recevier}`
      })
      this.canvas.renderAll()
    },
    /**
     * 添加图形
     */
    handleMenuClick (type) {
      const self = this
      if (!type) return
      switch (type) {
        case 'itext':
          let itext = this.itext = fb.addItext('新文字内容', {
            fontSize: 20,
            left: 100,
            top: this.scrollTop + 100
          })
          // 拓展字段
          itext = self.extendObject(itext, 'itext')
          this.canvas.add(itext)
          this.canvas.renderAll()
          break
        case 'image':
          this.openUploadImgDialog = true
          break
        case 'rect':
          const rect = this.rect = fb.addRect({
            left: 100,
            top: 100,
            width: 150,
            height: 100,
            fill: 'orange'
          })
          this.canvas.add(rect)
          break
        case 'circle':
          const circle = this.circle = fb.addCircle({
            radius: 50,
            fill: '#42b987',
            left: 100,
            top: 100
          })
          this.canvas.add(circle)
          break
        case 'triangle':
          const triangle = this.triangle = fb.addTriangle({
            width: 100,
            height: 100,
            fill: 'pink',
            left: 100,
            top: 100
          })
          this.canvas.add(triangle)
          break
      }
    },
    /**
     * 上传本地图片到Canvas画布
     * @return {[type]} [description]
     */
    uploadLocalImgToCanvas () {
      const self = this
      if (!this.localUploadUrl) return
      this.$fabric.Image.fromURL(this.localUploadUrl, oImg => {
        oImg.scale(0.5)
        oImg.set({
          left: 100,
          top: this.scrollTop + 100
        })
        // 拓展字段
        oImg = self.extendObject(oImg, 'image')
        this.canvas.add(oImg)
        // 设置为激活对象
        this.canvas.setActiveObject(oImg)
        this.setActiveObject(oImg)

        this.openUploadImgDialog = false
        this.localUploadUrl = ''
        // 新添加的靠前
        this.canvas.sendBackwards(oImg)
      })
    },
    /**
     * 处理本地图片上传
     */
    handleUploadChange (evt) {
      const self = this
      const file = evt.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          self.localUploadUrl = this.result
        }
      }
    },
    /**
     * 图片上传 Tab 切换触发
     */
    handleDialogTabChange (index) {
      if (index === 1) {
        this.getImageTypes()
      }
    },
    /**
     * 获取图片类型
     */
    getImageTypes (typeId = '') {
      this.imageTypeId = typeId
      this.getGalleryByTypeId(typeId)
    },
    /**
     * 处理图片点击事件
     */
    handleImgClick (evt) {
      this.selectedImg = evt.target
      this.selectedImgId = evt.target.dataset.id
    },
    /**
     * 处理官方图库图片选择
     */
    handleImgSelected () {
      this.$progress.start()
      this.sureBtnLoading = true
      this.$fabric.Image.fromURL(this.selectedImg.src, oImg => {
        oImg.scale(900 / oImg.width / 2)
        oImg.set({
          left: 100,
          top: this.scrollTop + 100
        })
        // 拓展字段
        oImg = this.extendObject(oImg, 'image')
        this.canvas.add(oImg)
        // 设置为激活对象
        this.canvas.setActiveObject(oImg)
        this.setActiveObject(oImg)

        this.canvas.renderAll()
        // 新添加的靠前
        this.canvas.sendBackwards(oImg)
        this.openUploadImgDialog = false
        this.sureBtnLoading = false
        this.$progress.done()
      }, {
        crossOrigin: 'Anonymous'
      })
    },
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
          this.navTabActived = 0
        }
      })
    },
    /**
     * 预览
     */
    previewCanvas () {
      this.openPreivewCanvasDialog = true
    },
    /**
     * 保存到服务器
     */
    handleSaveToRemote () {
      this.$confirm('确定要提交吗？', '提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.$progress.start()
          this.saveOrUpdateFabricDesign(JSON.stringify(this.canvas.toJSON())).then(() => {
            this.$progress.done()
            this.$toast.success({
              message: '保存成功',
              position: 'top'
            })
          }).catch(err => {
            this.$progress.done()
            this.$toast.error({
              message: err.response?.data?.detail,
              position: 'top'
            })
          })
        }
      })
    },
    /**
     * 保存到本地
     */
    handleDownloadToLocal () {
      this.$confirm('确定要保存到本地吗？', '提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.$progress.start()
          const id = getUrlParam('id') || Date.now()
          download(this.canvas.toDataURL({
            format: 'jpeg',
            multiplier: 2
          }), id)
          this.$progress.done()
        }
      })
    },
    /**
     * 退出编辑
     */
    handleQuitEditor () {
      this.$confirm('确定要退出编辑吗？', '提示', {
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
            this.this.clearLayers()
            this.$router.push({ path: '/login' })
          })
        }
      })
    },
    /**
     * 通过Id找到对象
     */
    getObjectById (id) {
      let o = null
      const arr = this.canvas.getObjects()
      const len = arr.length
      for (let i = 0; i < len; i++) {
        if (arr[i]._uuid === id) {
          o = arr[i]
          break
        }
      }
      return o
    },
    /**
     * 图形拷贝后回调
     */
    handleGraphCopyed (object) {
      if (!object) return
      this.canvas.sendBackwards(object)
      this.pushLayer({
        name: object.name,
        id: object._uuid,
        visible: true
      })
    },
    /**
     * 图层被选择回调
     */
    handleLayerSelected (id) {
      const o = this.getObjectById(id)
      if (o) {
        this.canvas.setActiveObject(o)
        this.canvas.renderAll()
      }
    },
    /**
     * 图层显示隐藏回调
     */
    handleLayerVisibled ({ id, visible }) {
      const o = this.getObjectById(id)
      if (o) {
        o.set({
          visible,
          selectable: visible
        })
        this.canvas.discardActiveObject(o)
        this.canvas.renderAll()
      }
    },
    /**
     * 图层被删除后回到处理
     */
    handleLayerRemoved (id) {
      const o = this.getObjectById(id)
      if (o) this.canvas.remove(o)
    },
    /**
     * 信息被修改后回调
     */
    handleInfoChanged (data) {
      this.taobaoId = data.taobaoNickname
      this.recevier = data.theRecipientName
      this.handleWatermark()
    }
  }
}
</script>

<style lang="scss" scoped>
$marginWidth: 300px;
$commonBg: #333;

@mixin position-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateZ(0);
}

.studio-page {
  background-color: #303030;
}

.mu-drawer.is-open {
  transform: translateZ(0);
  visibility: visible;
}
.mu-app-drawer {
  // border-right: 1px solid rgba(0,0,0,.12);
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}
.mu-drawer {
  width: $marginWidth;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: $commonBg;
  overflow: auto;
  border-radius: 0;
  z-index: 200;
}

.mu-appbar-header.is-open {
  left: $marginWidth;
}
.mu-appbar-header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 101;
  overflow: hidden;
}

.canvas-layout {
  position: absolute;
  top: 48px;
  left: $marginWidth;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: transparent;
  @include position-center;
}

// 上传弹框样式
.mu-uploadify-dialog {
  min-width: 350px;
  .image {
    margin-top: 15px;
    min-height: 150px;
    overflow-y: auto;
    &.remote-img {
      .image-types {
        .mu-button.active::before {
          content: '';
          background: currentColor;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: .12;
        }
      }
      .image-list {
        max-height: 350px;
        scroll-behavior: smooth;
        overflow-y: auto;
      }
      .image-list__inner {
        margin: 5px 15px 0 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          position: relative;
          align-self: center;
          flex-basis: 180px;
          background-color: #fff;
          cursor: pointer;
          border-radius: 4px;
          .superscript {
            display: none;
            position: absolute;
            top: -4px;
            right: 0;
            z-index: 9;
          }
          .item-img {
            max-width: 100%;
            transition: all .3s ease-out;
            opacity: 1;
          }
          &.active,
          &:hover {
            .superscript {
              display: block;
            }
            .item-img {
              opacity: .5;
            }
          }
        }
      }
    }
  }
}

.image-upload__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .image-upload {
    width:500px;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    text-align: center;
    color: #ccc;
    cursor: pointer;
    position: relative;
    background-size: cover;
    .cloud_upload {
      font-size: 80px;
    }
    &:hover {
      border: 1px dashed orange
    }
    .file-upload {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: transparent;
      opacity: 0;
      cursor: pointer;
    }
  }
}

// 属性表单样式
.mu-attr-form {
  .mu-form-item {
    // color: #fff;
  }
}

</style>
