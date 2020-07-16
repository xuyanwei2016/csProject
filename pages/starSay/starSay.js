//获取应用实例 
const app = getApp()
const api = require("../../api/label.js").API

Page({
  data: {
    subjectList:[],
    imageUrl: app.imageUrl,
    labelId: null,
  },
  onLoad: function (options) {
    this.setData({
      labelId: options.id
    })
    this.getList()
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  getList() {
    api.labelDetSubAPI({ labelContentId: this.data.labelId }).then(res => {
      if (res.data.code == 0) {
        this.setData({
          subjectList: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  subjectDetails(e) {
    var id = e.currentTarget.dataset.id //获取id值
    var template = e.currentTarget.dataset.template //获取template值
    if (template == 1) {
      wx.navigateTo({
        url: '../specialDetails/specialDetails?oid=' + id + "&name=大咖说税"
      })
    } else if (template == 2) {
      wx.navigateTo({
        url: '../specialList/specialList?oid=' + id,
      })
    }
  },
})