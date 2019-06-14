<template>
  <img :src="imgUrl" @click="click($event)">
</template>

<script>
export default {
  name: 'ImageLazyload',
  props: {
    src: {
      src: String,
      default: ''
    }
  },
  data () {
    return {
      imgUrl: '/img/img-placeholder.png'
    }
  },
  watch: {
    src () {
      this.loadImg()
    }
  },
  created () {
    this.loadImg()
  },
  methods: {
    click (evt) {
      this.$emit('click', evt)
    },
    loadImg () {
      const self = this
      const newImg = new Image()
      newImg.src = this.src
      newImg.onload = function () {
        self.imgUrl = this.src
      }
      newImg.onerror = function () {
        this.hidden = true
      }
    }
  }
}
</script>
