<template>
  <mu-form
    :model="attrsForm"
    class="mu-attrs-form"
    label-position="right"
    label-width="90"
  >
    <template v-if="graphType === 'itext'">
      <!-- 字体特有 -->
      <mu-form-item label="字号：">
        <mu-text-field
          v-model="attrsForm.itext.fontSize"
          :color="inputColor"
          suffix="px"
          :disabled="fieldDisabled"
          @input="setItextAttr('fontSize')"
        />
      </mu-form-item>

      <mu-form-item label="字体：">
        <mu-select
          v-model="attrsForm.itext.fontFamily"
          :color="inputColor"
          :disabled="fieldDisabled"
          @change="setItextAttr('fontFamily')"
        >
          <mu-option
            v-for="(font, index) in fonts"
            :key="index"
            :label="font.value"
            :value="font.name"
          />
        </mu-select>
      </mu-form-item>

      <mu-form-item label="样式：" class="format-size-style">
        <template v-if="fieldDisabled">
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
    </template>

    <!-- 共有 -->
    <mu-form-item label="左边距：">
      <mu-text-field
        v-model.number="attrsForm.left"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="px"
        @input="setObjectAttr('left')"
      />
    </mu-form-item>
    <mu-form-item label="上边距：">
      <mu-text-field
        v-model.number="attrsForm.top"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="px"
        @input="setObjectAttr('top')"
      />
    </mu-form-item>
    <mu-form-item label="宽度：">
      <mu-text-field
        v-model="attrsForm.width"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="px"
        @input="setObjectAttr('width')"
      />
    </mu-form-item>
    <mu-form-item label="高度：">
      <mu-text-field
        v-model="attrsForm.height"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="px"
        @input="setObjectAttr('height')"
      />
    </mu-form-item>
    <mu-form-item label="旋转：">
      <mu-slider
        v-model="attrsForm.angle"
        @change="setObjectAttr('angle')"
        :disabled="fieldDisabled"
        :color="inputColor"
        :min="-360"
        :max="360"
        :step="1"
      />
      <mu-text-field
        v-model.number="attrsForm.angle"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="角度(deg)"
        placeholder="-360°到360°之间的数字"
        @input="setObjectAttr('angle')"
      />
    </mu-form-item>

    <mu-form-item label="透明度：">
      <mu-slider
        v-model="attrsForm.opacity"
        @change="setObjectAttr('opacity')"
        :disabled="fieldDisabled"
        :color="inputColor"
        :min="-1"
        :max="1"
        :step="0.01"
      />
      <mu-text-field
        v-model.number="attrsForm.opacity"
        :color="inputColor"
        :disabled="fieldDisabled"
        suffix="透明度"
        placeholder="-1到1之间的数字"
        @input="setObjectAttr('opacity')"
      />
    </mu-form-item>

    <!-- 图片特有 -->
    <template v-if="graphType === 'image'">
      <mu-form-item label="亮度：">
        <mu-slider
          v-model="attrsForm.image.brightness"
          @change="setImageAttr(5, 'brightness')"
          :disabled="fieldDisabled"
          :color="inputColor"
          :min="-1"
          :max="1"
          :step="0.01"
        />
        <mu-text-field
          v-model.number="attrsForm.brightness"
          :disabled="fieldDisabled"
          :color="inputColor"
          suffix="亮度"
          placeholder="-1到1之间的数字"
          @input="setImageAttr(5, 'brightness')"
        />
      </mu-form-item>
    </template>

    <mu-form-item label="拷贝：">
      <mu-button
        :color="inputColor"
        :disabled="fieldDisabled"
        @click="copyGraph"
        flat small
      >
        <mu-icon left value="collections"/>
        复制{{ copyText }}
      </mu-button>
    </mu-form-item>

    <mu-form-item v-if="graphType === 'itext'">
      <mu-button
        @click="downloadFont"
      >
        下载字体<mu-icon left value="vertical_align_bottom"/>
      </mu-button>
    </mu-form-item>
  </mu-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { debounce } from 'lodash'
import ExtendObjectMixin from '@/mixins/extendObject.js'
import { download } from '@/utils'
import url from '@/utils/url'

export default {
  name: 'AppAttrsOfRside',
  mixins: [ExtendObjectMixin],
  data () {
    return {
      inputColor: '#ff9800',
      fileUrl: url.baseFileURL,
      attrsForm: {
        itext: {
          fontSize: 40,
          fontFamily: '',
          fontWeight: 'normal',
          fontStyle: 'normal',
          underline: false,
          overline: false,
          linethrough: false,
          fill: '#000000'
        },
        image: {
          brightness: 0
        },
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        angle: 0,
        opacity: 1
      }
    }
  },
  computed: {
    ...mapGetters([
      'canvas',
      'activeObject',
      'systemConfig',
      'fonts',
      'fieldDisabled',
      'graphType'
    ]),
    copyText () {
      return this.graphType ? (
        this.graphType === 'itext' ? '文本' : '图片'
      ) : ''
    }
  },
  mounted () {
    this.getSystemConfig()
  },
  watch: {
    activeObject () {
      this.initData()
    }
  },
  methods: {
    ...mapActions([
      'initFonts',
      'getSystemConfig',
      'setActiveObject'
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
        overline,
        linethrough,
        fill
      } = this.activeObject
      this.attrsForm.itext.fontSize = fontSize
      this.attrsForm.itext.fontFamily = fontFamily
      this.attrsForm.itext.fontStyle = fontStyle
      this.attrsForm.itext.fontWeight = fontWeight
      this.attrsForm.itext.fill = fill
      this.attrsForm.itext.underline = underline
      this.attrsForm.itext.overline = overline
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
     * 获取滤镜值
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
     * 下载字体
     */
    downloadFont () {
      // 下载字体
      download(this.fileUrl + this.systemConfig.productionRenderingSaveLocation, '字体.zip')
    },
    /**
     * 复制文本或图片
     */
    copyGraph () {
      const c = this.canvas
      const o = this.activeObject
      if (c && o) {
        const left = o.left
        const top = o.top
        o.clone(obj => {
          obj.set({
            left: left + 5,
            top: top + 5
          })
          obj = this.extendObject(obj, 'itext')
          c.add(obj)
          this.setActiveObject(obj)
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

<style lang="scss" scoped>
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
</style>
