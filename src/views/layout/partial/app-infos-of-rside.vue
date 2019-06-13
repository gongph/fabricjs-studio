<template>
  <mu-form
    :model="infosForm"
    class="mu-infos-form"
    label-position="top"
    label-width="90">
    <mu-form-item label="淘宝ID：">
      <mu-text-field
        v-model="infosForm.taobaoNickname"
        placeholder="请输入淘宝ID..."
        :color="inputColor"
        @input="handleInput"
      />
    </mu-form-item>
    <mu-form-item label="收件人姓名：">
      <mu-text-field
        v-model="infosForm.theRecipientName"
        placeholder="请输入收件人姓名..."
        :color="inputColor"
        @input="handleInput"
      />
    </mu-form-item>
    <mu-form-item label="编号：">
      <mu-text-field v-model="infosForm.customeNumber" disabled/>
    </mu-form-item>
    <mu-form-item label="品牌：">
      <mu-text-field v-model="infosForm.computerType" disabled/>
    </mu-form-item>
    <mu-form-item label="型号：">
      <mu-text-field v-model="infosForm.diePatternType" disabled/>
    </mu-form-item>
    <mu-form-item label="数量：">
      <mu-text-field v-model="infosForm.customQuantity" disabled/>
    </mu-form-item>
    <mu-form-item label="商品：">
      <mu-text-field v-model="infosForm.modelType" disabled/>
    </mu-form-item>
    <mu-form-item label="日期：">
      <mu-text-field v-model="infosForm.lastModifiedDate" disabled/>
    </mu-form-item>
  </mu-form>
</template>

<script>
import { parseTime } from '@/utils'
import { debounce } from 'lodash'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AppInfosOfRside',
  data () {
    return {
      inputColor: '#ff9800',
      infosForm: {
        customeNumber: 'DJ343432323232',
        computerType: '联想',
        diePatternType: '联想 G470 四面',
        customQuantity: '2',
        modelType: '笔记本',
        lastModifiedDate: '2017-01-02 10:12:10',
        taobaoNickname: 'yinlongfei',
        theRecipientName: 'gongpenghui'
      }
    }
  },
  computed: {
    ...mapGetters([
      'cacheSavedCustomTemplate'
    ])
  },
  created () {
    this.initData()
  },
  methods: {
    ...mapActions([
      'setTaobaoidRecevier'
    ]),
    initData () {
      const obj = this.cacheSavedCustomTemplate
      if (!obj) return
      this.infosForm.customeNumber = obj.customNumber
      this.infosForm.computerType = obj.diePattern.computerType.value
      this.infosForm.diePatternType = obj.diePattern.diePatternType
      this.infosForm.customQuantity = obj.customQuantity
      this.infosForm.modelType = obj.modelType.value
      this.infosForm.lastModifiedDate = parseTime(obj.lastModifiedDate, '{y}-{m}-{d} {h}:{i}:{s}')
      this.infosForm.taobaoNickname = obj.taobaoNickname
      this.infosForm.theRecipientName = obj.theRecipientName
    },
    handleInput: debounce(function () {
      const self = this
      self.setTaobaoidRecevier({ taobaoId: self.infosForm.taobaoNickname, recevier: self.infosForm.theRecipientName })
      this.$emit('info:changed', {
        taobaoNickname: this.infosForm.taobaoNickname,
        theRecipientName: this.infosForm.theRecipientName
      })
    }, 250)
  }
}
</script>
