import { mapGetters, mapActions } from 'vuex'
import URL from '@/utils/url.js'
import ExtendObjectMixin from '@/mixins/extendObject.js'
export default {
  mixins: [
    ExtendObjectMixin
  ],
  data () {
    return {
      baseImgUrl: URL.baseImgUrl
    }
  },
  computed: {
    ...mapGetters([
      'canvas',
      'waterText',
      'dieLineBg',
      'cacheLinePathDiePatternPath',
      'dieBg'
    ])
  },
  methods: {
    ...mapActions([
      'setDieLinebg'
    ]),
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
     * 置顶一个Fabric对象
     * @param {Object} object Fabric's install
     */
    bringToFront (object) {
      this.canvas.bringToFront(object)
    },
    /**
     * 置顶模糊图和水印内容
     */
    bringDiebgAndWater () {
      const self = this
      if (self.dieBg) {
        self.bringToFront(self.dieBg)
      }
      if (self.dieLineBg && parseInt(this.$route.query.type) === 1) {
        self.bringToFront(self.dieLineBg)
      }
      if (self.waterText) {
        self.bringToFront(self.waterText)
      }
    },
    /**
     * 显示线模图
     */
    showDieLineBg () {
      const self = this
      // 初始化线模图
      if (self.cacheLinePathDiePatternPath && parseInt(this.$route.query.type) === 1) {
        self.$fabric.Image.fromURL(
          `${self.baseImgUrl}${self.cacheLinePathDiePatternPath}`,
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
            self.canvas.add(oImg)
          }, {
            crossOrigin: 'Anonymous'
          }
        )
      }
    }
  }
}
