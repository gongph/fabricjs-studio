<template>
  <mu-dialog
    width="360"
    transition="slide-bottom"
    fullscreen
    :open.sync="open"
    dialog-class="mu-preview-canvas-dialog"
  >
    <mu-appbar
      :z-depth="2"
      color="#303030"
      text-color="#ddd"
      title="预览"
      class="mu-fixed-appbar"
    >
      <mu-button slot="right" icon @click="close">
        <mu-icon value="close"></mu-icon>
      </mu-button>
    </mu-appbar>
    <div
      class="canvas-wrapper"
      data-mu-loading-color="orange"
      data-mu-loading-overlay-color="#303030"
      data-mu-loading-text="正在生成预览效果，请稍等..."
      v-loading="loading"
    >
      <canvas id="c"></canvas>
    </div>
  </mu-dialog>
</template>

<script>
import fb from '@/utils/fabric'
import { mapGetters } from 'vuex'
export default {
  name: 'PreviewCanvas',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    ...mapGetters([
      'canvas'
    ])
  },
  mounted () {
    const originJSON = this.canvas.toJSON()
    setTimeout(() => {
      var preview = fb.initStatic(document.getElementById('c'), {
        name: 'StaticCanvas',
        width: this.canvas.width,
        height: this.canvas.height
      })
      preview.loadFromJSON(originJSON)
      this.loading = false
    }, 0)
  },
  methods: {
    close () {
      this.$emit('update:open')
    }
  }
}
</script>

<style lang="scss">
.mu-preview-canvas-dialog {
  .mu-dialog-body {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #5f5d5d;
  }
  canvas {
    display: block;
    margin: 0 auto;
  }
  .mu-fixed-appbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }
  .canvas-wrapper {
    padding: 60px 0 30px 0;
  }
}
</style>
