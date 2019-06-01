<template>
  <div class="sidebar-layer">
    <div class="sidebar-layer_inner">
      <!-- 无数据 -->
      <template v-if="layers.length <= 0">
        <mu-flex
          class="mu-empty-wrapper"
          justify-content="center"
          align-items="center"
          id="draggable"
        >
          <mu-icon value="sentiment_satisfied" size="18"/>
          <span class="msg">暂时还没有数据哦~</span>
        </mu-flex>
      </template>
      <!-- 列表 -->
      <template v-else>
        <div class="flex" id="draggable">
          <div v-for="(item, $index) of layers" class="item" :key="$index">
            <!-- 图层 -->
            <div
              class="layer"
              :class="objectId === item.id ? 'active' : ''"
              @click="handleSelected(item.id)"
            >
              <div class="icon">
                <mu-icon :value="item.name === 'itext' ? 'title' : 'insert_photo'"></mu-icon>
              </div>
              <div class="content">
                {{ item.name === 'itext' ? '文本' + ($index + 1) : '图片' + ($index + 1) }}
              </div>
            </div>
            <!-- 操作 -->
            <div class="actions">
              <mu-button small icon color="#CCC" @click="handleVisibe(item)">
                <mu-icon :value="item.visible ? 'visibility' : 'visibility_off' "></mu-icon>
              </mu-button>
              <mu-button small icon color="#CCC" @click="handleRemove(item.id)">
                <mu-icon value="delete_sweep"></mu-icon>
              </mu-button>
              <mu-button class="mu-draggable" small icon color="#CCC">
                <mu-icon value="format_line_spacing"></mu-icon>
              </mu-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Sortable from 'sortablejs'
export default {
  name: 'SidebarLayer',
  props: {
    activeId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      sortable: null,
      objectId: this.activeId,
      isVisible: this.visible
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
      'setLayerValue'
    ]),
    initSortable () {
      if (this.layers.length <= 0) return
      this.sortable = Sortable.create(
        document.getElementById('draggable'),
        {
          animation: 300,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          handle: '.mu-draggable',
          ghostClass: 'sortable-ghost'
        }
      )
    },
    handleVisibe (item) {
      this.setLayerValue({
        id: item.id,
        key: 'visible',
        value: !item.visible
      }).then(() => {
        this.$emit('update:visible')
        this.$emit('layer:visibled', { id: item.id, visible: item.visible })
      })
    },
    /**
     * 图层被选择
     */
    handleSelected (id) {
      this.objectId = id
      this.$emit('update:activedId', id)
      this.$emit('layer:selected', id)
    },
    /**
     * 删除图层
     * @param  {String} id 图层id
     */
    handleRemove (id) {
      this.removeLayer(id).then(() => {
        this.$emit('layer:removed', id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mu-empty-wrapper {
  padding-top: 20px;
  color: #828282;
  user-select: none;
  .msg {
    padding-left: 3px;
  }
}
.flex {
  display: flex;
  flex-direction: column;
  .item {
    position: relative;
    height: 32px;
    margin: 20px;
    display: flex;
    justify-content: center;
    background-color: #333;
    user-select: none;
    .layer {
      width: 100px;
      background-color: rgba(95, 93, 93, 0.25);
      color: #ccc;
      transition: background-color .3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      .icon {
        height: 24px;
        align-self: center;
        padding-right: 3px;
      }
      &.active,
      &:hover {
        background-color: rgba(95, 93, 93, 0.5);
        cursor: pointer;
        color: orange;
      }
    }
    .actions {
      flex: 1;
      background-color: transparent;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      .mu-draggable {
        cursor: move;
      }
    }
    & + .item {
      margin-top: 0px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: -9px;
        right: 0;
        z-index: 999;
        height: 1px;
        background-color: rgba(95, 93, 93, 0.5);
      }
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}
.sortable-ghost {
  opacity: 0.5;
}
</style>
