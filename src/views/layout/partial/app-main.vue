<template>
  <div class="main-wrapper">
    <happy-scroll color="rgba(120,120,120, .5)" hide-horizontal resize>
      <div class="main-content">
        <div class="canvas-wrapper">
          <canvas id="canvas"></canvas>
        </div>
      </div>
    </happy-scroll>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VarMixin from '@/mixins/var.js'
import LoadingMixin from '@/mixins/loading.js'
import ProgressMixin from '@/mixins/progress.js'
import ExtendObjectMixin from '@/mixins/extendObject.js'
import { baseImgUrl, gererateUUID } from '@/utils'
import { fromEvent } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import fb from '@/utils/fabric'

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
      layerActiveId: '' // 图层激活Id，用于设置样式
    }
  },
  watch: {
    $route (to, from) {
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
    }
  },
  computed: {
    ...mapGetters([
      'cacheDiePatternPath',
      'cacheLinePathDiePatternPath',
      'taobaoId',
      'recevier',
      'waterText',
      'dieBg',
      'dieLineBg',
      'cacheModelType',
      'taobaoNickname',
      'theRecipientName'
    ]),
    // 水印文字
    waterStr: function () {
      return '淘宝ID：' + this.taobaoId + '    收件人姓名：' + this.recevier
    }
  },
  created () {
    const self = this
    // 初始化淘宝id和收件人信息
    self.setTaobaoidRecevier({ taobaoId: self.taobaoNickname, recevier: self.theRecipientName })
    // this.taobaoId = this.taobaoNickname
    // this.recevier = this.theRecipientName
  },
  mounted () {
    this.initFabric()
  },
  methods: {
    ...mapActions([
      'setCanvas',
      'setDiebg',
      'setDieLinebg',
      'setWaterText',
      'setGraphType',
      'setFieldDisabled',
      'pushLayer',
      'setActiveObject',
      'delActiveObject',
      'getFabricJsonById',
      'setTaobaoidRecevier',
      'setTabActived',
      'getCustomTemplateByCustomNumber'
    ]),
    /**
     * 初始化Fabric
     */
    initFabric () {
      const self = this
      const loading = self.loading()
      self.progressStart()
      // 查询是否有已设计的素材
      const { bh: customNumber, id, type } = self.$route.query
      self.getCustomTemplateByCustomNumber({
        id,
        type,
        customNumber
      }).then(response => {
        // 获取服务器上保存的素材JSON
        return self.getFabricJsonById(id)
      }).then(data => {
        let originJson = null
        if (data) originJson = data.originJson
        self.initCanvas(canvas => {
          if (!originJson) {
            // 没有数据重新创建
            self.createFabric(canvas)
          } else {
            // 有数据加载
            self.loadFromJSON(canvas, originJson)
          }
          // 保存到 Vuex
          self.setCanvas(canvas)
          // 初始化选择框样式
          self.initCornerStyle()
          // 初始化事件
          self.initEvents()
          // 释放Loading
          setTimeout(() => {
            self.progressDone()
            loading.close()
          }, 100)
        })
      }).catch(err => {
        console.error(err)
      })
    },
    /**
     * 初始化 Canvas
     * @param {Function} cb 回调函数
     */
    initCanvas (cb) {
      const self = this
      const image = new Image()
      image.src = `${baseImgUrl}${self.cacheDiePatternPath}`
      image.onload = () => {
        // 初始化Canvas画布
        const canvas = self.canvasObject = fb.init(
          document.getElementById('canvas'),
          {
            name: 'canvas',
            backgroundColor: '#fff',
            width: image.width / 4,
            height: image.height / 4,
            stopContextMenu: true,
            backgroundVpt: false
          },
          self.canvasObject
        )
        cb(canvas)
      }
    },
    /**
     * 创建Fabric
     */
    createFabric (canvas) {
      const self = this
      self.$fabric.Image.fromURL(
        `${baseImgUrl}${self.cacheDiePatternPath}`,
        oImg => {
          oImg.scale(0.25)
          oImg.set({
            selectable: false,
            evented: false,
            moveCursor: 'default',
            hoverCursor: 'default'
          })
          oImg = self.extendObject(oImg, 'diebg', false) // 拓展字段
          self.setDiebg(oImg)
          canvas.add(oImg)
          self.initWatermark() // 初始化水印
        }, {
          crossOrigin: 'Anonymous'
        }
      )
      // 初始化线模图
      if (self.cacheLinePathDiePatternPath && parseInt(this.$route.query.type) === 1) {
        self.$fabric.Image.fromURL(
          `${baseImgUrl}${self.cacheLinePathDiePatternPath}`,
          oImg => {
            oImg.scale(0.25)
            oImg.set({
              selectable: false,
              evented: false,
              moveCursor: 'default',
              hoverCursor: 'default'
            })
            oImg = self.extendObject(oImg, 'dielinebg', false) // 拓展字段
            self.setDieLinebg(oImg)
            canvas.add(oImg)
          }, {
            crossOrigin: 'Anonymous'
          }
        )
      }
    },
    /**
     * 从加载JSON以便重新渲染Fabric
     */
    loadFromJSON (canvas, originJson) {
      const self = this
      canvas.loadFromJSON(
        originJson,
        canvas.renderAll.bind(canvas),
        function (o, object) {
          // 重新设置对象的 name 属性
          if (object.type === 'image') {
            if (object.name === 'diebg') {
              // 给背景图赋值，方便将来给该图层置顶
              self.setDiebg(object)
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
                visible: true,
                kclass: object
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
              visible: true,
              kclass: object
            })
          } else if (object.type === 'text') {
            // 水印文字
            object.set({
              name: 'waterText',
              _uuid: -1,
              evented: false,
              text: self.waterStr,
              selectable: false
            })
            self.setWaterText(object)
          }

          // 置顶模具背景和水印
          self.bringDiebgAndWater()

          // 应用拓展字段
          object.toObject = (function (toObject) {
            return function () {
              return self.$fabric.util.object.extend(toObject.call(this), {
                name: this.name,
                _uuid: this._uuid
              })
            }
          })(object.toObject)
        }
      )
      // 初始化线模图
      if (self.cacheLinePathDiePatternPath && parseInt(this.$route.query.type) === 1) {
        self.$fabric.Image.fromURL(
          `${baseImgUrl}${self.cacheLinePathDiePatternPath}`,
          oImg => {
            oImg.scale(0.25)
            oImg.set({
              selectable: false,
              evented: false,
              moveCursor: 'default',
              hoverCursor: 'default'
            })
            oImg = self.extendObject(oImg, 'dielinebg', false) // 拓展字段
            self.setDieLinebg(oImg)
            canvas.add(oImg)
          }, {
            crossOrigin: 'Anonymous'
          }
        )
      }
    },
    /**
     * 初始化选中框样式
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
      const canvas = self.canvasObject
      // 素材获取焦点
      fromEvent(canvas, 'selection:created').pipe(
        debounceTime(100)
      ).subscribe(x => {
        // 默认现实的是信息页面
        self.setTabActived(1)
      })
      // 素材失去焦点
      fromEvent(canvas, 'selection:cleared').pipe(
        debounceTime(100)
      ).subscribe(x => {
        // 默认现实的是信息页面
        self.setTabActived(2)
        self.bringDiebgAndWater()
        canvas.discardActiveObject(canvas.getActiveObject())
      })

      // 鼠标按下事件
      fromEvent(canvas, 'mouse:down').pipe(
        debounceTime(100)
      ).subscribe(opt => {
        let target = opt.target
        // 处理有些对象没有name属性导致图层缺失的bug
        if (target && !target.name) {
          const name = target.type === 'image' ? 'image' : 'itext'
          target = self.extendObject(target, name)
        }

        if (target) {
          self.layerActiveId = target._uuid
          self.setActiveObject(opt.target)
          self.setGraphType(target.name)
          self.setFieldDisabled(false)
        } else {
          self.delActiveObject()
          self.setFieldDisabled(true)
        }
      })
    },
    /**
     * 初始化水印(淘宝ID和收件人姓名)
     */
    initWatermark () {
      const self = this
      if (!parseInt(this.$route.query.type)) return
      let waterText = fb.addText(self.waterStr, {
        fontFamily: 'Microsoft YaHei',
        fill: '#fff',
        evented: false,
        selectable: false
      })

      // 如果是`笔记本`
      if (parseInt(this.$route.query.type) === 1) {
        waterText.scale(0.125)
        waterText.set({
          left: 150,
          top: 0
        })
      } else if (parseInt(this.$route.query.type) === 2) {
        // 如果是`鼠标垫`
        waterText.scale(0.175)
        waterText.set({
          left: 20,
          top: 10,
          angle: 90
        })
      }
      waterText = self.extendObject(waterText, 'waterText', false)
      self.canvasObject.add(waterText)
      self.setWaterText(waterText)
    }
  }
}
</script>
