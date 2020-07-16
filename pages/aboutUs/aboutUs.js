// pages/aboutUs/aboutUs.js
var app = getApp()
const api = require("../../api/login.js").API
Page({
  data: {
    banben:'',
    copy:'',
    desc:''
  },

  onReady: function () {
    api.boutUs().then(res => {
      if(res.data.code==0){
        this.setData({
          banben: res.data.data.value
        })
      }
    })
    let obj={
      cnkey: '关于我们'
    }
    api.getzcAreement(obj).then( res => {
      if(res.data.code==0){
        this.setData({
          desc: res.data.data.value
        })
      }
    })

    api.aboutUsDesc().then( res => {
      if (res.data.code == 0) {
        this.setData({
          copy: res.data.data.value
        })
      }
    })
  }
})