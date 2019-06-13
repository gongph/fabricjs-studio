<template>
  <div class="rside-wrapper">
    <div class="rside-top">
      <div class="title-wrapper">
        <div class="title" :class="tabActived === 1 ? 'active' : ''" @click="handleTab(1)">属性</div>
        <div class="title" :class="tabActived === 2 ? 'active' : ''" @click="handleTab(2)">信息</div>
        <divide/>
      </div>
      <div class="content-wrapper">
        <happy-scroll color="rgba(120,120,120, 0)" hide-horizontal resize>
          <!-- 属性表单 -->
          <app-attrs-of-rside v-if="tabActived === 1"/>
          <!-- 信息表单 -->
          <app-infos-of-rside v-else/>
        </happy-scroll>
      </div>
    </div>
    <div class="rside-bottom">
      <div class="title-wrapper">
        <divide/>
        <div class="drag-indicator">
          <svg-icon icon-class="drag"/>
        </div>
        <div class="title active">图层</div>
        <divide/>
      </div>
      <div class="content-wrapper">
        <!-- 图层 -->
        <app-layer-of-rside/>
      </div>
    </div>
  </div>
</template>

<script>
import AppAttrsOfRside from './app-attrs-of-rside.vue'
import AppInfosOfRside from './app-infos-of-rside.vue'
import AppLayerOfRside from './app-layer-of-rside.vue'
import Divide from '@/components/divide/index.vue'
export default {
  name: 'AppRside',
  components: {
    AppAttrsOfRside,
    AppInfosOfRside,
    AppLayerOfRside,
    Divide
  },
  data () {
    return {
      tabActived: 1
    }
  },
  methods: {
    handleTab (index) {
      this.tabActived = index
    }
  }
}
</script>
