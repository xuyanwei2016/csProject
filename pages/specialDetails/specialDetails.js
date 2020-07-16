// pages/specialDetails/specialDetails.js
const app = getApp()
const api = require("../../api/special.js").API

Page({
  data: {
    oid: null,
    urlPath: app.imageUrl,
    imagePath: app.requestUrl,
    specialForm: {},
    smallList: []
  },
  onLoad: function (options) {
    console.log(options,'0000')
    let name = options.name
    options.name && options.name.length > 10 ? name = options.name.substring(0,10)+'...' : name = options.name
    wx.setNavigationBarTitle({ title: name })
    this.setData({
      oid: options.oid
    })
    this.getDetails()
  },
  getDetails() {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    api.getSpecialDetails(this.data.oid).then(res => {
      if (res.data.code == 0) {
        this.setData({
          specialForm: res.data.data,
        })
        console.log(this.data.specialForm,8899)
        if (this.data.specialForm.template == 1) {
          this.setData({
            smallList: res.data.data.pmrListVO
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  toClass: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../classDetails/classDetails?id='+id,
    })
  },
  onPullDownRefresh: function () {

  },
})