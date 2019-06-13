export default {
  methods: {
    loading (text) {
      text = text || '正在为您准备画布，请稍等...'
      const opts = {
        text,
        color: '#ffa500', // orange
        overlayColor: '#303030'
      }
      return this.$loading(opts)
    }
  }
}
