<template>
  <div class="sidebar-base flex">
    <div v-for="item in data" class="item" :key="item.id">
      <div class="item-inner" @click="onclick(item.id)">
        <svg-icon :icon-class="item.icon"/>
      </div>
    </div>
  </div>
</template>

<script>
import { menus } from './sidebar'
export default {
  name: 'SidebarBase',
  computed: {
    data () {
      return menus
    }
  },
  methods: {
    onclick (id) {
      this.$emit('click', id)
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin position-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) translateZ(0);
}
.flex {
  display: flex;
  margin: 10px;
  .item {
    width: 100px;
    height: 100px;
    color: #c3c3c3;
    font-size: 40px;
    cursor: pointer;
    transition: all .3s ease-in;
    position: relative;
    & .item-inner {
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      outline: 1px dashed #c3c3c3;
      @include position-center;
    }
    &:hover {
      background-color: #272727;
    }
  }
}
</style>
