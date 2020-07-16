var app = getApp()

Component({ // 组件的属性列表
  behaviors: [],
  properties: {
    dataList: {
      type: Array,
      value: ''
    },
  },
  data: {//组件的初始数据
    urlPath: app.imageUrl,
    imgPath: app.requestUrl
  },
  methods: { //组件的方法列表
    goDetails(e) {
      this.triggerEvent('goDetails', { id: e.currentTarget.dataset.id })
    }
    // detailsPage(e) {
    //   let name = e.currentTarget.dataset.type
    //   if (name == 'articleDetails' && e.currentTarget.dataset.ispdf == 1) {//文章阅读页
    //     wx.navigateTo({ //跳转
    //       url: "../pdfRead/pdfRead?id=" + e.currentTarget.dataset.id
    //     })
    //   } else {
    //     wx.navigateTo({ //跳转
    //       url: "../" + name + "/" + name + "?id=" + e.currentTarget.dataset.id
    //     })
    //   }

    // },
  },

})
