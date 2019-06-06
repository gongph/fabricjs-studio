<template>
  <div class="sidebar-attrs">
    <mu-form
      :model="form"
      class="mu-infos-form"
      label-position="top"
      label-width="90"
    >
      <mu-form-item label="编号：">
        <mu-text-field
          v-model="form.customeNumber"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="品牌：">
        <mu-text-field
          v-model="form.computerType"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="型号：">
        <mu-text-field
          v-model="form.diePatternType"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="数量：">
        <mu-text-field
          v-model="form.customQuantity"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="商品：">
        <mu-text-field
          v-model="form.modelType"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="日期：">
        <mu-text-field
          v-model="form.lastModifiedDate"
          disabled
        />
      </mu-form-item>

      <mu-form-item label="淘宝ID：">
        <mu-text-field
          v-model="form.taobaoNickname"
          placeholder="请输入淘宝ID..."
          :color="inputColor"
          @input="handleInput"
        />
      </mu-form-item>

      <mu-form-item label="收件人姓名：">
        <mu-text-field
          v-model="form.theRecipientName"
          placeholder="请输入收件人姓名..."
          :color="inputColor"
          @input="handleInput"
        />
      </mu-form-item>

    </mu-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { debounce } from 'lodash'
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarInfos',
  data () {
    return {
      inputColor: '#ff9800',
      form: {
        customeNumber: '',
        computerType: '',
        diePatternType: '',
        customQuantity: '',
        modelType: '',
        lastModifiedDate: '',
        taobaoNickname: '',
        theRecipientName: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'fabricDesign'
    ])
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      const obj = this.fabricDesign
      if (!obj) return
      this.form.customeNumber = obj.customTemplate.customNumber
      this.form.computerType = obj.customTemplate.diePattern.computerType.value
      this.form.diePatternType = obj.customTemplate.diePattern.diePatternType
      this.form.customQuantity = obj.customTemplate.customQuantity
      this.form.modelType = obj.customTemplate.modelType.value
      this.form.lastModifiedDate = parseTime(obj.lastModifiedDate)
      this.form.taobaoNickname = obj.customTemplate.taobaoNickname
      this.form.theRecipientName = obj.customTemplate.theRecipientName
    },
    handleInput: debounce(function () {
      this.$emit('info:changed', {
        taobaoNickname: this.form.taobaoNickname,
        theRecipientName: this.form.theRecipientName
      })
    }, 250)
  }
}
</script>

<style lang="scss">
.mu-infos-form {
  padding: 10px 25px 25px;
  .mu-form-item-label {
    color: hsla(0,0%,100%,.65);
    text-shadow: 0px 1px 5px #000;
  }
  .mu-input-content{
    // width: 85%;
    font-size: 12px;
  }
  .mu-text-field-input {
    width: 85%;
    color: orange;
  }
  .mu-form-item {
    margin-bottom: 0;
  }
  .mu-input-line.disabled {
    border-bottom: 1px dotted rgb(95, 93, 93);
  }
}
</style>
