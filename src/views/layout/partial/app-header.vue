<template>
  <mu-appbar
    :z-depth="2"
    class="header-wrapper"
    color="#535353"
  >
    <svg-icon icon-class="logo"/>
    <mu-button small flat slot="right">
      <mu-icon left value="cached"></mu-icon> 重做
    </mu-button>
    <mu-button small flat slot="right">
      <mu-icon left value="remove_red_eye"></mu-icon> 保存预览
    </mu-button>
    <mu-button small flat slot="right">
      <mu-icon left value="cloud_upload"></mu-icon> 提交设计
    </mu-button>
    <mu-button small flat slot="right">
      <mu-icon left value="vertical_align_bottom"></mu-icon> 保存到本地
    </mu-button>
    <mu-button small flat slot="right">
      <mu-icon left value="reply"></mu-icon> 退出编辑
    </mu-button>
    <mu-button small flat slot="right" color="#ff9800">
      欢迎您，龙飞
    </mu-button>
    <mu-menu slot="right" open-on-hover>
      <mu-button small flat>
        <mu-icon value="more_vert"></mu-icon>
      </mu-button>
      <mu-list slot="content">
        <mu-list-item button>
          <mu-list-item-title>
            退出系统
          </mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-menu>
  </mu-appbar>
</template>
