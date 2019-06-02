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
import { SidebarBase, SidebarAttrs, SidebarLayer } from './layout'
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
      scrollTop: 100
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
  mounted () {
    if (this.diePatternId > 0) {
      this.initFabric()
    } else {
      this.saveCustomTemplates().then(response => {
        this.initFabric()
      }).catch(err => {
        console.error(err)
      })
    }
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
      'diePatternPath',
      'diePatternId',
      'galleryTypes',
      'gallerys',
      'taobaoId',
      'recipientName'
    ])
  },
  methods: {
    ...mapActions([
      'signOut',
      'setCanvas',
      'setActiveObject',
      'delActiveObject',
      'saveCustomTemplates',
      'getGalleryTypes',
      'getGalleryByTypeId',
      'pushLayer',
      'updateCustomTemplates'
    ]),
    /**
     * 初始化Fabric
     * @return {[type]} [description]
     */
    initFabric () {
      const self = this
      const loading = this.$loading({
        overlayColor: '#303030',
        color: 'orange',
        className: 'mu-custom-loading',
        text: '正在为您准备画布，请稍等...'
      })
      const image = new Image()
      image.src = `${baseImgUrl}${self.diePatternPath}`
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
        self.setCanvas(this.canvas)
        // 加载背景磨具图片
        self.$fabric.Image.fromURL(
          `${baseImgUrl}${self.diePatternPath}`,
          (oImg) => {
            oImg.scale(0.5)
            oImg.set({
              name: 'diebg',
              selectable: false,
              evented: false,
              moveCursor: 'default',
              hoverCursor: 'default'
            })
            canvas.add(oImg)
            // 初始化水印
            self.initWatermark()
            // 初始化选中样式
            self.initCornerStyle()
            // 初始化事件
            self.initEvents()
          }, {
            crossOrigin: 'Anonymous'
          }
        )
        setTimeout(() => {
          loading.close()
          self.loading = false
        }, 0)
      }
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
        const target = opt.target
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
    /**
     * 添加水印。淘宝ID和收件人姓名
     */
    initWatermark (opt = { left: 150, top: 10 }) {
      const text = fb.addText(
        `淘宝ID：${this.taobaoId}    收件人姓名：${this.recipientName}`,
        {
          name: 'text',
          fontFamily: '微软雅黑',
          fill: '#ccc',
          left: opt.left,
          top: opt.top,
          evented: false,
          selectable: false
        }
      )
      text.scale(0.25)
      this.canvas.add(text)
    },
    /**
     * 添加图形
     */
    handleMenuClick (type) {
      if (!type) return
      switch (type) {
        case 'itext':
          const itext = this.itext = fb.addItext('新文字内容', {
            _uuid: gererateUUID(),
            name: 'itext',
            fontSize: 20,
            left: 100,
            top: this.scrollTop + 100
          })
          this.canvas.add(itext)
          this.pushLayer({
            name: itext.name,
            id: itext._uuid,
            visible: true
          })
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
      if (!this.localUploadUrl) return
      this.$fabric.Image.fromURL(this.localUploadUrl, oImg => {
        oImg.scale(0.5)
        oImg.set({
          _uuid: gererateUUID(),
          name: 'image',
          left: 100,
          top: this.scrollTop + 100
        })
        this.canvas.add(oImg)
        this.canvas.setActiveObject(oImg)
        this.setActiveObject(oImg)
        this.openUploadImgDialog = false
        this.localUploadUrl = ''
        this.pushLayer({
          name: oImg.name,
          id: oImg._uuid,
          visible: true
        })
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
      this.sureBtnLoading = true
      this.$fabric.Image.fromURL(this.selectedImg.src, oImg => {
        oImg.scale(900 / oImg.width / 2)
        oImg.set({
          _uuid: gererateUUID(),
          name: 'image',
          left: 100,
          top: this.scrollTop + 100
        })
        this.canvas.add(oImg)
        this.canvas.setActiveObject(oImg)
        this.setActiveObject(oImg)
        this.canvas.renderAll()
        this.pushLayer({
          name: oImg.name,
          id: oImg._uuid,
          visible: true
        })
        // 新添加的靠前
        this.canvas.sendBackwards(oImg)
        this.openUploadImgDialog = false
        this.sureBtnLoading = false
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
          this.updateCustomTemplates(JSON.stringify(this.canvas.toJSON())).then(() => {
            this.$toast.success({
              message: '提交成功',
              position: 'top'
            })
          }).catch(err => {
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
          const id = getUrlParam('id') || Date.now()
          download(this.canvas.toDataURL({ format: 'jpeg' }), id)
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
