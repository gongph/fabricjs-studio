import { fabric } from 'fabric'
// 给object对象扩展toObject方法name和uuid属性
// fabric.Object.prototype.toObject = (function (toObject) {
//   return function () {
//     return fabric.util.object.extend(toObject.call(this), {
//       name: this.name || '_name_',
//       _uuid: this._uuid || '_id_'
//     })
//   }
// })(fabric.Object.prototype.toObject)
//
// // 给object对象扩展initialize
// fabric.Object.prototype.initialize = (function (initialize) {
//   return function () {
//     return fabric.util.object.extend(initialize.call(this), {
//       name: this.name || '_name_',
//       _uuid: this._uuid || '_id_'
//     })
//   }
// })(fabric.Object.prototype.initialize)
//
// fabric.Object.prototype.fromObject = (function (fromObject) {
//   return function () {
//     return fabric.util.object.extend(fromObject.call(this), {
//       name: this.name,
//       _uuid: this._uuid
//     })
//   }
// })(fabric.Object.prototype.fromObject)

fabric.NamedImage = fabric.util.createClass(fabric.Image, {
  type: 'named-image',
  initialize: function (element, options) {
    this.callSuper('initialize', element, options)
    options && this.set('name', options.name) && this.set('_uuid', options._uuid)
  },
  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name, _uuid: this._uuid })
  }
})

fabric.NamedImage.fromURL = function (url, callback, imgOptions) {
  fabric.util.loadImage(url, function (img) {
    callback && callback(new fabric.NamedImage(img, imgOptions));
  }, null, imgOptions && imgOptions.crossOrigin);
}

fabric.NamedImage.fromObject = function (object, callback) {
  fabric.util.loadImage(object.src, function (img) {
    callback && callback(new fabric.NamedImage(img, object))
  })
}

fabric.NamedText = fabric.util.createClass(fabric.Text, {
  type: 'named-text',
  initialize: function (element, options) {
    this.callSuper('initialize', element, options)
    options && this.set('name', options.name)
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name })
  }
})

fabric.NamedText.fromObject = function (object, callback) {
  return fabric.Object._fromObject('NamedText', object, callback, 'namedText')
}

fabric.NamedIText = fabric.util.createClass(fabric.IText, {
  type: 'named-itext',
  initialize: function (element, options) {
    this.callSuper('initialize', element, options)
    options && this.set('name', options.name)
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), { name: this.name })
  }
})

fabric.NamedIText.fromObject = function (object, callback) {
  return fabric.Object._fromObject('NamedIText', object, callback, 'namedIText')
}

//
// // create image element
// var img = document.createElement('img');
// img.src = 'https://www.google.com/images/srpr/logo3w.png';
//
// // create an instance of named image
// var namedImg = new fabric.NamedImage(img, { name: 'foobar' });
//
// // add it to canvas
// canvas.add(namedImg);
//
// // save json
// var json = JSON.stringify(canvas);
//
// // clear canvas
// canvas.clear();
//
// // and load everything from the same json
// canvas.loadFromJSON(json, function() {
//
//   // making sure to render canvas at the end
//   canvas.renderAll();
//
//   // and checking if object's "name" is preserved
//   console.log(canvas.item(0).name);
// });

export default {
  init (c, opt) {
    let canvas = new fabric.Canvas(c, opt)
    return canvas
  },
  addFromURL (src, callback, opt) {
    return fabric.NamedImage.fromURL(src, callback, opt)
  },
  initStatic (c, opt) {
    let staticCanvas = new fabric.StaticCanvas(c, opt)
    return staticCanvas
  },
  addItext (text, opt) {
    let iText = new fabric.NamedIText(text, opt)
    return iText
  },
  addText (text, opt) {
    let text1 = new fabric.NamedText(text, opt)
    return text1
  },
  addRect (opt) {
    let rect = new fabric.Rect(opt)
    return rect
  },
  addCircle (opt) {
    let circle = new fabric.Circle(opt)
    return circle
  },
  addTriangle (opt) {
    let triangle = new fabric.Triangle(opt)
    return triangle
  },
  /**
   * 事件
   */
  event: {
    //
  }
}
