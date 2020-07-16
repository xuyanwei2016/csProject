var app = getApp()
const api = require("../../api/review.js").API

Component({
  behaviors: [],
  properties: {//组件的属性列表
    titleData: {
      type: String,
      value: 'default value'
    },
    code: {
      type: String,
      value: 'default value'
    }
  },
  data: {
    urlPath: app.imageUrl,
  },
  methods: {//组件的方法列表
    courseList(e) {
      this.triggerEvent('courseList', { code: e.currentTarget.dataset.code })
    },
    

  }
})
