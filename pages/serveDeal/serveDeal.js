const api = require("../../api/common.js").API

Page({
  data: {
    content: null,
  },
  onLoad: function (options) {
    this.getContent()
  },
  getContent() {
    let params = {
      cnkey: '会员服务协议'
    }
    api.getDeal(params).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          content: res.data.data.value
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
})