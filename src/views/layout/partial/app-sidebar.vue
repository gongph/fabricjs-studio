<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-wrapper__inner">
      <div class="tool-item" @click="onclick('itext')">
        <mu-tooltip content="添加文字" placement="right">
          <svg-icon icon-class="add-font"/>
        </mu-tooltip>
        <divide/>
      </div>
      <div class="tool-item" @click="onclick('local-img')">
        <mu-tooltip content="本地图片上传" placement="right">
          <svg-icon icon-class="local-upload"/>
        </mu-tooltip>
        <divide/>
      </div>
      <div class="tool-item" @click="onclick('remote-img')">
        <mu-tooltip content="远程图库" placement="right">
          <svg-icon icon-class="remote-img"/>
        </mu-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import Divide from '@/components/divide/index.vue'
import ExtendObjectMixin from '@/mixins/extendObject.js'
import VarMixin from '@/mixins/var.js'
import fb from '@/utils/fabric'
export default {
  name: 'AppSidebar',
  mixins: [ExtendObjectMixin, VarMixin],
  components: { Divide },
  methods: {
    onclick (type) {
      const self = this
      switch (type) {
        case 'itext':
          let itext = fb.addItext('新文字内容', {
            fill: '#ff9800',
            fontSize: 20,
            left: 100,
            top: 200
          })
          itext = self.extendObject(itext, 'itext')
          self.canvas.add(itext)
          self.canvas.renderAll()
          self.bringDiebgAndWater()
          break
        case 'local-img':
          break
        case 'remote-img':
          break
      }
      self.$emit('click', type)
    }
  }
}
</script>
