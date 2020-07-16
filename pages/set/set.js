// pages/set/set.js
var app = getApp()
const api = require("../../api/login.js").API
Page({

  toUs(){
    wx.navigateTo({
      url: "../aboutUs/aboutUs"
    })
  },
  toFeedback(){
    wx.navigateTo({
      url: "../feedback/feedback"
    })
  },
  signout(){
    
    api.logout().then( res => {
      if(res.data.code==0){
        wx.removeStorageSync('loginCode')
        wx.removeStorageSync('code'),
        wx.removeStorageSync('y-token')
        wx.removeStorageSync('avatarUrl')
        wx.removeStorageSync('nickName')
        wx.reLaunch({
          url: "../my/index"
        })
      }else{
        wx.showToast({
          title: '退出登录失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
    
  },
  onShareAppMessage: function (options) {
    return {
      title: "财税专家",        
      path: '/pages/index/index',       
      imageUrl: '/images/common/index.png'
    }
  }
})