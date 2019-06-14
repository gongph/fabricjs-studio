export default {
  methods: {
    loading (opts) {
      const config = opts || {
        text: '正在为您准备画布，请稍等...',
        color: '#ffa500', // orange
        overlayColor: '#303030'
      }
      return this.$loading(config)
    }
  }
}
