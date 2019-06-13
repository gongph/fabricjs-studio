import { gererateUUID } from '@/utils'
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions(['pushLayer']),
    /**
     * 拓展字段
     * @param {Object} [target] Fabric对象实例
     * @param {String} name 对象的名字
     * @param {Boolean} ispush 是否推送到图层数组
     */
    extendObject (target, name, ispush = true) {
      const self = this
      target.set({
        name,
        _uuid: gererateUUID()
      })

      if (ispush) {
        this.pushLayer({
          name: target.name,
          id: target._uuid,
          visible: true,
          kclass: target
        })
      }

      target.toObject = (function (toObject) {
        return function () {
          return self.$fabric.util.object.extend(toObject.call(this), {
            name: this.name,
            _uuid: this._uuid
          })
        }
      })(target.toObject)
      return target
    }
  }
}
