const app = getApp()

Page({
  data: {
    livePath:'',
    liveUrl: app.livePath,
  },
  onLoad: function (options) {
    this.setData({
      livePath: this.data.liveUrl + options.id
    })
  }
})