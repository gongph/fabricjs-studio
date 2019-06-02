import { fabric } from 'fabric'

export default {
  init (c, opt) {
    return new fabric.Canvas(c, opt)
  },
  initStatic (c, opt) {
    return new fabric.StaticCanvas(c, opt)
  },
  addItext (text, opt) {
    return new fabric.IText(text, opt)
  },
  addText (text, opt) {
    return new fabric.Text(text, opt)
  },
  addRect (opt) {
    return new fabric.Rect(opt)
  },
  addCircle (opt) {
    return new fabric.Circle(opt)
  },
  addTriangle (opt) {
    return new fabric.Triangle(opt)
  },
  /**
   * 事件
   */
  event: {
    //
  }
}
