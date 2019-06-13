<template>
  <div class="sidebar-attrs">
    <div class="sidebar-attrs_inner">
      <mu-form :model="attrsForm" class="mu-attr-form" label-position="right" label-width="90">
        <!-- 字体特有 -->
        <template v-if="graphType === 'itext'">
          <mu-form-item label="字号：">
            <mu-text-field
              v-model="attrsForm.itext.fontSize"
              :color="inputColor"
              suffix="px"
              :disabled="disabled"
              @input="setItextAttr('fontSize')"
            />
          </mu-form-item>

          <mu-form-item label="字体：">
            <mu-select
              v-model="attrsForm.itext.fontFamily"
              :color="inputColor"
              :disabled="disabled"
              @change="setItextAttr('fontFamily')"
            >
              <mu-option
                v-for="(font, index) in fonts"
                :key="index"
                :label="font.value"
                :value="font.value"
              />
            </mu-select>
          </mu-form-item>

          <mu-form-item label="样式：" class="format-size-style">
            <template v-if="disabled">
              <mu-icon value="format_bold" class="unactive"></mu-icon>
              <mu-icon value="format_italic" class="unactive"></mu-icon>
              <mu-icon value="format_underlined" class="unactive"></mu-icon>
              <mu-icon value="format_strikethrough" class="unactive"></mu-icon>
              <mu-icon value="palette" class="unactive"></mu-icon>
            </template>
            <template v-else>
              <mu-tooltip placement="top" content="粗体">
                <mu-icon
                  value="format_bold"
                  :class="attrsForm.itext.fontWeight !== 'normal' ? 'actived' : ''"
                  @click="setItextAttr('fontWeight')"
                />
              </mu-tooltip>
              <mu-tooltip placement="top" content="斜体">
                <mu-icon
                  value="format_italic"
                  :class="attrsForm.itext.fontStyle !== 'normal' ? 'actived' : ''"
                  @click="setItextAttr('fontStyle')"
                />
              </mu-tooltip>
              <mu-tooltip placement="top" content="下划线">
                <mu-icon
                  value="format_underlined"
                  :class="attrsForm.itext.underline ? 'actived' : ''"
                  @click="setItextAttr('underline')"
                />
              </mu-tooltip>
              <mu-tooltip placement="top" content="中划线">
                <mu-icon
                  value="format_strikethrough"
                  :class="attrsForm.itext.linethrough ? 'actived' : ''"
                  @click="setItextAttr('linethrough')"
                />
              </mu-tooltip>
              <mu-tooltip placement="top" content="颜色">
                <div class="color-picker">
                  <mu-icon
                    value="palette"
                    :color="attrsForm.itext.fill"
                  />
                  <input
                    v-model="attrsForm.itext.fill"
                    class="mu-color-input"
                    type="color"
                    @change="handleColorChange"
                  >
                </div>
              </mu-tooltip>
            </template>
          </mu-form-item>
          <divide></divide>
        </template>

        <!-- 共有 -->
        <mu-form-item label="左边距：">
          <mu-text-field
            v-model.number="attrsForm.left"
            :color="inputColor"
            :disabled="disabled"
            suffix="px"
            @input="setObjectAttr('left')"
          />
        </mu-form-item>

        <mu-form-item label="上边距：">
          <mu-text-field
            v-model.number="attrsForm.top"
            :color="inputColor"
            :disabled="disabled"
            suffix="px"
            @input="setObjectAttr('top')"
          />
        </mu-form-item>

        <mu-form-item label="高度：">
          <mu-text-field
            v-model="attrsForm.height"
            :color="inputColor"
            :disabled="disabled"
            suffix="px"
            @input="setObjectAttr('height')"
          />
        </mu-form-item>

        <mu-form-item label="旋转：">
          <mu-slider
            v-model="attrsForm.angle"
            :color="inputColor"
            :min="-360"
            :max="360"
            :step="1"
            :disabled="disabled"
            @change="setObjectAttr('angle')"
          />
        </mu-form-item>

        <mu-form-item label="透明度：">
          <mu-slider
            v-model="attrsForm.opacity"
            :color="inputColor"
            :min="-1"
            :max="1"
            :step="0.01"
            :disabled="disabled"
            @change="setObjectAttr('opacity')"
          />
        </mu-form-item>

        <!-- 图片特有 -->
        <template v-if="graphType === 'image'">
          <mu-form-item label="亮度：">
            <mu-slider
              v-model="attrsForm.image.brightness"
              :color="inputColor"
              :min="-1"
              :max="1"
              :step="0.01"
              :disabled="disabled"
              @change="setImageAttr(5, 'brightness')"
            />
          </mu-form-item>
        </template>
        <mu-form-item label="拷贝：">
          <mu-button flat small :color="inputColor" @click="copyGraph">
            <mu-icon
              left
              :value="graphType === 'itext' ? 'text_fields' : 'collections'"
            />
            复制{{ graphType === 'itext' ? '文本' : '图片' }}
          </mu-button>
        </mu-form-item>
      </mu-form>
    </div>
  </div>
</template>

<script>
import Divide from '@/components/divide/index.vue'
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'lodash'
import { gererateUUID } from '@/utils'

export default {
  name: 'SidebarAttrs',
  components: { Divide },
  data () {
    return {
      attrsForm: {
        itext: {
          // 字体大小
          fontSize: 40,
          // 字体
          fontFamily: '微软雅黑',
          // 字体粗细
          fontWeight: 'normal',
          // 字体风格
          fontStyle: 'normal',
          // 下划线
          underline: false,
          // 上划线
          overline: false,
          // 中划线
          linethrough: false,
          // 填充色
          fill: '#000000'
        },
        image: {
          // 亮度
          brightness: 0,
          // 对比度
          contrast: 50,
          // 色相
          hue: 50,
          // 饱和度
          saturation: 50,
          // 颗粒
          noise: 0,
          // 像素化
          pixelate: 0,
          // 模糊
          blur: 0,
          // 滤镜
          filter: ''
        },
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        // 旋转
        angle: 0,
        // 透明度
        opacity: 1
      },
      inputColor: '#ff9800'
      // fonts: ['微软雅黑', '黑体', '宋体', '隶书']
      // 滤镜
      // filters: [
      //   { label: '正常', value: '' },
      //   { label: '灰-中性', value: 'average' },
      //   { label: '灰-昏暗', value: 'luminosity' },
      //   { label: '灰-明亮', value: 'average' },
      //   { label: '枯叶落', value: 'invert' },
      //   { label: '清秋', value: 'sepia' },
      //   { label: '黑白', value: 'blackwhite' },
      //   { label: '白桦林', value: 'brownie' },
      //   { label: '复古', value: 'vintage' },
      //   { label: '胶片', value: 'kodachrome' },
      //   { label: '彩色', value: 'technicolor' },
      //   { label: '海风', value: 'polaroid' }
      // ]
    }
  },
  props: {
    // 图形类型
    graphType: {
      type: String,
      default: 'itext'
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'canvas',
      'activeObject',
      'fonts'
    ])
  },
  created () {
    this.initData()
    this.initFonts()
  },
  methods: {
    ...mapActions([
      'initFonts'
    ]),
    /**
     * 初始化数据
     */
    initData () {
      if (this.activeObject) {
        if (this.activeObject.name === 'itext') this.initItextData()
        if (this.activeObject.name === 'image') this.initImageData()

        const { left, top, width, height, angle, opacity } = this.activeObject
        this.attrsForm.left = Math.round(left)
        this.attrsForm.top = Math.round(top)
        this.attrsForm.width = Math.round(width)
        this.attrsForm.height = Math.round(height)
        this.attrsForm.angle = angle
        this.attrsForm.opacity = opacity
      }
    },
    /**
     * 初始化文本数据
     */
    initItextData () {
      const {
        fontSize,
        fontFamily,
        fontStyle,
        fontWeight,
        underline,
        linethrough,
        fill
      } = this.activeObject
      this.attrsForm.itext.fontSize = fontSize
      this.attrsForm.itext.fontFamily = fontFamily
      this.attrsForm.itext.fontStyle = fontStyle
      this.attrsForm.itext.fontWeight = fontWeight
      this.attrsForm.itext.fill = fill
      this.attrsForm.itext.underline = underline
      this.attrsForm.itext.linethrough = linethrough
    },
    /**
     * 初始化图片数据
     */
    initImageData () {
      const val = this.getFilterVal(5, 'brightness')
      if (val) {
        this.attrsForm.image.brightness = val
      } else {
        this.$fabric.filterBackend = this.$fabric.initFilterBackend()
        // this.$fabric.filterBackend = new fabric.Canvas2dFilterBackend()
        this.applyFilters(5, new this.$fabric.Image.filters.Brightness({
          brightness: this.attrsForm.image.brightness
        }))
      }
    },
    /**
     * 应用滤镜
     */
    applyFilters (index, filter) {
      const activeObject = this.activeObject
      if (activeObject) {
        activeObject.filters[index] = filter
        activeObject.applyFilters()
        this.canvas.renderAll()
      }
    },
    /**
     * 设置滤镜值
     */
    setFilterVal (index, prop, value) {
      const activeObject = this.activeObject
      if (activeObject.filters[index]) {
        activeObject.filters[index][prop] = value
        activeObject.applyFilters()
        this.canvas.renderAll()
      }
    },
    /**
     * 获取率净值
     */
    getFilterVal (index, prop) {
      const activeObject = this.activeObject
      if (activeObject.filters[index]) {
        return activeObject.filters[index][prop]
      }
      return ''
    },
    /**
     * 设置文本属性
     */
    setItextAttr: debounce(function (key) {
      const val = this.attrsForm.itext[key]
      const NORMAL = 'normal'
      let value = val
      if (key === 'fontWeight') {
        if (val === NORMAL) {
          value = 'bold'
        } else {
          value = NORMAL
        }
      } else if (key === 'fontStyle') {
        if (val === NORMAL) {
          value = 'italic'
        } else {
          value = NORMAL
        }
      } else {
        if (typeof val === 'boolean') {
          value = !val
        }
      }
      this.attrsForm.itext[key] = value
      this.activeObject.set(key, value)
      this.canvas.renderAll()
    }, 250),
    /**
     * 设置图片属性
     */
    setImageAttr: debounce(function (index, key) {
      const val = this.attrsForm.image[key]
      this.setFilterVal(index, key, val)
    }, 250),
    /**
     * 设置对象属性
     */
    setObjectAttr: debounce(function (key) {
      const val = this.attrsForm[key]
      let value = val
      if (key === 'left' || key === 'top') {
        if (!/\d/.test(Number(val))) {
          value = 100
          this.attrsForm[key] = value
        }
        this.activeObject.set(key, value)
      } else if (key === 'width') {
        const originWidth = this.activeObject.width
        value = val / originWidth
        this.activeObject.set('scaleX', value)
      } else if (key === 'height') {
        const originHeight = this.activeObject.height
        value = val / originHeight
        this.activeObject.set('scaleY', value)
      } else if (key === 'angle') {
        this.activeObject.set({
          left: this.activeObject.getCenterPoint().x,
          top: this.activeObject.getCenterPoint().y,
          originX: 'center',
          originY: 'center',
          angle: value
        })
      } else {
        this.activeObject.set(key, value)
      }
      this.canvas.renderAll()
    }, 250),
    /**
     * 改变字体颜色
     */
    handleColorChange (evt) {
      this.attrsForm.itext.fill = evt.target.value || ''
      this.setItextAttr('fill')
    },
    /**
     * 复制
     */
    copyGraph () {
      const c = this.canvas
      const o = this.activeObject
      if (c && o) {
        const name = o.name
        const left = o.left
        const top = o.top
        o.clone(obj => {
          obj.set({
            _uuid: gererateUUID(),
            name,
            left: left + 5,
            top: top + 5
          })
          c.add(obj)
          this.$emit('graph:copyed', obj)
        })
      } else {
        this.$toast.info({
          icon: 'warning',
          close: false,
          message: '请选择一个对象',
          position: 'top'
        })
      }
    }
  }
}
</script>

<style lang="scss">
.sidebar-attrs {
  .sidebar-attrs_inner {
    // padding: 10px 35px 10px 10px;
    box-sizing: border-box;
  }
  .mu-attr-form {
    .mu-form-item-label {
      color: hsla(0,0%,100%,.65);
      text-shadow: 0px 3px 5px #000;
    }
    .mu-input-content,
    .mu-slider {
      width: 85%;
      font-size: 12px;
    }
    .mu-text-field-input,
    .mu-select-input {
      color: orange;
    }
    .mu-form-item {
      margin-bottom: 0;
    }
    .mu-input-suffix-text {
      color: #8a8a8a;
    }
    .format-size-style {
      .mu-icon {
        color: #8a8a8a;
        cursor: pointer;
        &.actived,
        &:hover {
          outline: 1px dashed currentColor;
        }
        & + .mu-icon {
          margin-left: 10px;
          box-sizing: border-box;
        }
        &.actived {
          background: #282828;
        }
        &.unactive {
          cursor: not-allowed;
          &:hover {
            outline: none;
          }
        }
      }
      .color-picker {
        display: inline-block;
        position: relative;
        margin-left: 10px;
        .mu-color-input {
          position: absolute;
          width: 24px;
          height: 24px;
          left: 0;
          opacity: 0;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
