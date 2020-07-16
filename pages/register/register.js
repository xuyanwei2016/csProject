// pages/login/login.js
var app = getApp()
const api = require("../../api/login.js").API
let i = 60;
let flag = 1;
Page({
  data: {
    getCode: true,
    second: 60,
    ajxtrue:false,
   
    phoneCode:{
      phone:''
    },
    surf:{
      phone: '',
      code: '',
      channel: '',
    }
  },
  onLoad(){
    let that = this;
    wx.getSystemInfo({
      
      success: function (res) {
        
        let system = res.system;
        
        console.log(system.indexOf('Android'), system.indexOf('iOS'))
        if (system.indexOf('Android')!=-1){
          that.setData({
            ['surf.channel']: 2
          })
        } else if (system.indexOf('iOS') != -1){
          that.setData({
            ['surf.channel']: 3
          })
        }
      }
    })
  },
  //点击立即注册
  toLogin: function (e) {
    if (this.data.ajxtrue && this.data.surf.code){
      let existCode = wx.getStorageSync('code')
      if (this.data.surf.code== existCode){
        console.log(this.data.surf)
        api.toRegister(this.data.surf).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              duration: 1000
            })
            wx.getUserInfo({
              success: function (res) {
                console.log(res, 9)
              }
            })
            wx.reLaunch({
              url: "../login/login"
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }else{
        wx.showToast({
          title: '验证码输入错误',
          icon: 'none',
          duration: 1000
        })
      }
      
    }else{
      wx.showToast({
        title: '请补全信息',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //获取手机号
  bindPhoneInput:function(e){
    this.setData({
      ['surf.phone']:e.detail.value,
      ['phoneCode.phone'] : e.detail.value
    })

    //验证手机号
    let that = this

    let phone = e.detail.value

    let regs = /^(13\d|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18\d|19[89])\d{8}$/

    if (!(regs.test(phone)) || phone.length > 11) {
      
      this.setData({
        ajxtrue: false
      })
      
      wx.showToast({
        title: '手机号有误',
        icon: 'none',
        duration: 1000
      })
      
    } else {
      this.setData({
        ajxtrue: true
      })
    }
  },
  //获取输入的验证码
  bindCodeInput: function (e) {
    this.setData({
      ['surf.code']: e.detail.value
    })
  },

  //获取验证码
  getCode: function () {
    //发送手机验证码
    if (this.data.ajxtrue){
      api.getCode(this.data.phoneCode).then( res => {
        if(res.data.code == 0){
          wx.showToast({
            title: '验证码发送成功',
            icon: 'none',
            duration: 1000
          })
          wx.setStorageSync('code', res.data.data.replace(/[^0-9]/ig, ""))
          this.setData({
            getCode: false
          })
          this.countDown()
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
    }
    
    
  },
  //验证码倒计时
  countDown: function () {
    let that = this;
    i = i - 1;
    this.setData({
      second: i
    })
    if (i == 0) {
      this.setData({
        getCode: true
      })
      flag = 1;
      i = 60;
      return;
    }
    setTimeout(function () {
      that.countDown()
    }, 1000);
  },
  //去协议
  userCon(){
    wx.navigateTo({
      url: "../zcAgreement/zcAgreement"
    })
  }
})