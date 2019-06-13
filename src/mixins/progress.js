export default {
  methods: {
    progressStart () {
      return this.$progress.start()
    },
    progressDone () {
      return this.$progress.done()
    }
  }
}
