// pages/zcAgreement/zcAgreement.js
var app = getApp()
const api = require("../../api/login.js").API
Page({

  data: {
    agreement:''
  },

  onReady: function () {
    let ojb={
      cnkey:'用户注册协议'
    }
    api.getzcAreement(ojb).then(res => {
      if(res.data.code==0){
        console.log(res)
        this.setData({
          agreement:res.data.data.value
        })
      }
    })
  }
})