<template>
  <happy-scroll :color="scrollColor" hide-horizontal resize>
    <div id="layers">
      <div v-for="(layer, $index) of layers" class="layer" :key="$index">
        <div class="visible">
          <mu-icon
            size="16"
            :value="layer.visible ? 'visibility' : 'visibility_off'"
            @click="handleVisible(layer)"
          />
          <mu-icon
            size="16"
            value="delete_sweep"
            @click="handleDelete(layer.id)"
          />
        </div>
        <div
          class="view"
          :class="activeId === layer.id ? 'active' : ''"
          @click="handleSelected(layer.id)"
        >
          <div class="box"></div>
          <div class="text">
            {{ layer.name === 'itext'
              ? '文本' + ($index + 1)
              : '图片' + ($index + 1)
            }}
          </div>
        </div>
      </div>
    </div>
  </happy-scroll>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VarMixin from '@/mixins/var.js'
import Sortable from 'sortablejs'

export default {
  name: 'AppLayerOfRside',
  mixins: [VarMixin],
  props: {
    activedIndex: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollColor: 'rgba(120,120,120, .5)',
      activeId: this.activedIndex
    }
  },
  computed: {
    ...mapGetters([
      'layers'
    ])
  },
  mounted () {
    this.initSortable()
  },
  methods: {
    ...mapActions([
      'removeLayer',
      'setLayerValue',
      'setFieldDisabled',
      'setActiveObject',
      'setGraphType'
    ]),
    /**
     * 初始化排序
     */
    initSortable () {
      this.$nextTick(() => {
        Sortable.create(document.getElementById('layers'), {
          animation: 300,
          handle: '.layer',
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          ghostClass: 'sortable-ghost'
        })
      })
    },
    /**
     * 处理图层是否可见
     */
    handleVisible (item) {
      const id = item.id
      const visible = !item.visible
      this.setLayerValue({
        id,
        key: 'visible',
        value: visible
      }).then(() => {
        // 删除对应的对象
        const o = this.getObjectById(id)
        if (o) {
          o.set({
            visible,
            selectable: visible
          })
          this.canvas.discardActiveObject(o)
          this.setFieldDisabled(!visible)
          this.canvas.renderAll()
        }
        // 对外暴露一个回调
        this.$emit('layer:visibled', { id, visible })
      })
    },
    /**
     * 处理图层是否删除
     */
    handleDelete (id) {
      this.$confirm('确定要删除该图层吗？', '提示', {
        type: 'info'
      }).then(({ result }) => {
        if (result) {
          this.removeLayer(id).then(() => {
            const o = this.getObjectById(id)
            if (o) {
              this.canvas.remove(o)
              this.setFieldDisabled(true)
            }
            this.$emit('layer:removed', id)
          })
        }
      })
    },
    /**
     * 处理图层选择
     */
    handleSelected (id) {
      this.activeId = id
      const o = this.getObjectById(id)
      if (o) {
        this.canvas.setActiveObject(o)
        this.setActiveObject(o)
        this.setGraphType(o.name)
        this.setFieldDisabled(false)
        this.canvas.renderAll()
      }
      this.$emit('update:activedIndex', id)
      this.$emit('layer:selected', id)
    }
  }
}
</script>

<style lang="scss" scoped>
.sortable-ghost {
  opacity: 0.5;
}
</style>
