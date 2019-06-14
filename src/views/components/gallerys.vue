<template>
  <mu-dialog
    width="640"
    title="官方图库"
    dialog-class="mu-uploadify-dialog"
    :overlay-opacity="0.5"
    :open.sync="isOpen"
    @close="handleClose"
  >
    <!-- 图片类型 -->
    <div class="image-types">
      <mu-button
        textColor="#333"
        href="javascript:;" small flat
        @click="getImageBytypeId()"
        :class="!activeTypeId ? 'active' : ''"
      >
        全部
      </mu-button>
      <mu-button
        v-for="(type, $index) of galleryTypes"
        textColor="#333"
        href="javascript:;"
        :class="activeTypeId === type.id ? 'active' : ''"
        :key="$index"
        @click="getImageBytypeId(type.id)"
        small flat
      >
        {{ type.name }}
      </mu-button>
    </div>

    <mu-divider></mu-divider>

    <!-- 图片列表 -->
    <div
      data-mu-loading-color="#2196f3"
      data-mu-loading-overlay-color="rgba(0, 0, 0, .1)"
      v-loading="imgLoading"
      class="image-list"
    >
      <happy-scroll color="rgba(120,120,120, .5)" hide-horizontal resize>
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
            ></image-lazyload>
          </div>
        </div>
      </happy-scroll>
    </div>

    <!-- 操作 -->
    <mu-button
      slot="actions"
      flat
      color="primary"
      @click="handleClose"
    >
      取消
    </mu-button>
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
  </mu-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ImageLazyload from '@/components/ImgLazyload/index.vue'
import VarMixin from '@/mixins/var.js'
import ProgressMixin from '@/mixins/progress.js'
import ExtendObjectMixin from '@/mixins/extendObject.js'
export default {
  name: 'Gallerys',
  mixins: [VarMixin, ProgressMixin, ExtendObjectMixin],
  components: { ImageLazyload },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isOpen: this.open,
      activeTypeId: '',
      selectedImgId: '',
      imgLoading: true,
      sureBtnLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'galleryTypes',
      'gallerys'
    ])
  },
  watch: {
    open () {
      this.isOpen = this.open
    }
  },
  created () {
    this.getGalleryTypes()
    this.getGalleryByTypeId()
    this.closeLoading()
  },
  methods: {
    ...mapActions([
      'getGalleryTypes',
      'getGalleryByTypeId',
      'setActiveObject',
      'setFieldDisabled',
      'setGraphType'
    ]),
    getImageBytypeId (typeId = '') {
      this.activeTypeId = typeId
      this.imgLoading = true
      this.getGalleryByTypeId(typeId)
      this.closeLoading()
    },
    handleImgClick (evt) {
      this.selectedImg = evt.target
      this.selectedImgId = evt.target.dataset.id
    },
    handleClose (val) {
      this.isOpen = false
      this.$emit('update:open', false)
    },
    /**
     * 处理官方图库图片选择
     */
    handleImgSelected () {
      this.progressStart()
      this.sureBtnLoading = true
      this.$fabric.Image.fromURL(this.selectedImg.src, oImg => {
        oImg.scaleToWidth(200)
        oImg.scaleToHeight(oImg.height / oImg.width * 200.0)
        oImg.set({
          left: 100,
          top: 200
        })
        // 拓展字段
        oImg = this.extendObject(oImg, 'image')
        this.canvas.add(oImg)
        // 设置为激活对象
        this.canvas.setActiveObject(oImg)
        this.setActiveObject(oImg)

        // 新添加的靠前
        this.setActiveObject(oImg)
        this.setGraphType(oImg.name)
        this.setFieldDisabled(false)
        this.bringDiebgAndWater()
        this.isOpen = false
        this.sureBtnLoading = false
        this.progressDone()
      }, {
        crossOrigin: 'Anonymous'
      })
    },
    closeLoading () {
      setTimeout(() => {
        this.imgLoading = false
      }, 250)
    }
  }
}
</script>

<style lang="scss" scoped>
.mu-uploadify-dialog {
  min-width: 350px;
}
.image-types {
  .mu-button.active::before {
    content: '';
    background: orange;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: .12;
  }
}
.image-list {
  height: 350px;
  overflow-x: hidden;
  overflow-y: auto;
}

.image-list__inner {
  margin: 5px 15px 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  width: 94%;
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
</style>
