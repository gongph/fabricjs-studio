<template>
  <div class="sidebar-wrapper">
    <div class="sidebar-wrapper__inner">
      <div v-for="item of tools" :key="item.id" class="tool-item" @click="onclick(item.id)">
        <mu-tooltip :content="item.title" placement="right">
          <svg-icon :icon-class="item.icon"/>
        </mu-tooltip>
        <divide/>
      </div>
    </div>

    <!-- 远程图库弹框 -->

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Divide from '@/components/divide/index.vue'
import ExtendObjectMixin from '@/mixins/extendObject.js'
import VarMixin from '@/mixins/var.js'
import ProgressMixin from '@/mixins/progress.js'
import fb from '@/utils/fabric'
import { uploadify } from '@/utils/file-upload.js'

export default {
  name: 'AppSidebar',
  mixins: [ExtendObjectMixin, VarMixin, ProgressMixin],
  components: { Divide },
  data () {
    return {
      tools: [
        { id: 'itext', title: '添加文字', icon: 'add-font' },
        { id: 'local-img', title: '本地图片上传', icon: 'local-upload' },
        { id: 'remote-img', title: '远程图库', icon: 'remote-img' }
      ]
    }
  },
  methods: {
    ...mapActions([
      'setActiveObject',
      'setFieldDisabled',
      'setGraphType'
    ]),
    onclick (type) {
      const self = this
      switch (type) {
        case 'itext':
          self.handleAddText()
          break
        case 'local-img':
          self.handleAddLocalImg()
          break
        case 'remote-img':
          break
      }
      self.$emit('click', type)
    },
    /**
     * 创建上传元素
     */
    createFileElement () {
      let fileEl = document.getElementById('file')
      if (!fileEl) {
        const fileField = document.createElement('input')
        fileField.id = 'file'
        fileField.type = 'file'
        fileField.name = 'file'
        fileField.accept = 'image/png, image/jpeg'
        fileField.style = 'display: none;'
        fileEl = fileField
      }
      return fileEl
    },
    /**
     * 处理添加文字
     */
    handleAddText () {
      const self = this
      let itext = fb.addItext('新文字内容', {
        fill: '#ff9800',
        fontSize: 20,
        left: 100,
        top: 200
      })
      itext = self.extendObject(itext, 'itext')
      self.canvas.add(itext)
      self.canvas.setActiveObject(itext)

      self.setActiveObject(itext)
      self.setGraphType(itext.name)
      self.setFieldDisabled(false)
      self.bringDiebgAndWater()
    },
    /**
     * 处理添加本地图片
     */
    handleAddLocalImg () {
      const self = this
      const fileEl = self.createFileElement()
      fileEl.click()
      document.body.append(fileEl)

      fileEl.onabort = function () { alert() }
      fileEl.onchange = function (evt) {
        self.progressStart()
        const file = evt.target.files[0]
        if (!/^image\/(png|jpg|jpeg)$/.test(file.type)) {
          self.$toast.error({
            message: '只能上传jpg、jpeg、png格式的图片',
            position: 'top'
          })
          return
        }

        // 上传
        uploadify(file).then(response => {
          const { bucketName, fileName } = response
          self.$fabric.Image.fromURL(
            `${self.baseImgUrl}/${bucketName}/${fileName}`,
            oImg => {
              oImg.scaleToWidth(200)
              oImg.scaleToHeight(oImg.height / oImg.width * 200.0)
              oImg.set({ left: 100, top: 200 })

              oImg = self.extendObject(oImg, 'image')

              self.canvas.add(oImg)
              self.canvas.setActiveObject(oImg)

              self.setActiveObject(oImg)
              self.setGraphType(oImg.name)
              self.setFieldDisabled(false)
              self.bringDiebgAndWater()
              self.progressDone()
            }
          )
        })
      }
    }
  }
}
</script>
