// pages/login/login.js
var app = getApp()
const api = require("../../api/login.js").API
let i=60;
let flag=1;
Page({
  data: {
    getCode:true,
    second:60,
    ajxtrue: false,
    phoneCode: {
      phone: ''
    },
    loginData:{
      code:null,
      channel:4, //登录渠道 4-小程序 5-H5
      phone:null
    },
    openid:'',
    session_key :'',
    wxPhnoe:{
      channel:null,
      phone:null,
      wechatKey:null
    },
    isTrue: true,
  },
  onLoad() {
    // let that = this;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     let system = res.system;
    //     if (system.indexOf('Android') != -1) {
    //       that.setData({
    //         ['loginData.channel']: 2,
    //         ['wxPhnoe.channel']: 2
    //       })
    //     } else if (system.indexOf('iOS') != -1) {
    //       that.setData({
    //         ['loginData.channel']: 3,
    //         ['wxPhnoe.channel']: 3
    //       })
    //     }
    //   }
    // })
  },
  aa(e) {
    console.log(e)
  },
  //登录
  bindGetUserInfo: function(e) {
    if (this.data.ajxtrue && this.data.loginData.code) {
      // let existCode = wx.getStorageSync('loginCode')
      // if (this.data.loginData.code == existCode) {
        api.toLogin(this.data.loginData).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '登录成功',
              icon: 'none',
              duration: 1000
            })
            wx.setStorageSync('y-token', res.data.data.token)
            // if (e.detail.userInfo) {
            //   //用户按了允许授权按钮
            //   wx.setStorage({
            //     key: "avatarUrl",
            //     data: e.detail.userInfo.avatarUrl
            //   })
            //   wx.setStorage({
            //     key: "nickName",
            //     data: e.detail.userInfo.nickName,
              
            //   })
            // } else {
            //   //用户按了拒绝按钮
            //   wx.showToast({
            //     title: '获取微信信息失败',
            //     icon: 'none',
            //     duration: 1000
            //   })
            // }
            wx.reLaunch({
              url: "../index/index"
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      // } else {
      //   wx.showToast({
      //     title: '验证码输入错误',
      //     icon: 'none',
      //     duration: 1000
      //   })
      // }

    } else {
      wx.showToast({
        title: '请补全信息',
        icon: 'none',
        duration: 1000
      })
    }
    
  

  },

  //手机号
  bindPhoneInput(e){
    console.log(e,33333)
    this.setData({
      ['phoneCode.phone']: e.detail.value
    })
  },
  //验证码
  bindCodeInput(e){
    console.log(e,6666)
    this.setData({
      ['loginData.code']: e.detail.value
    })
  },
  //微信登录
  wxLogin(){
    wx.login({
      success: res => {
        let that = this;
        let code = {code:res.code}
        api.wechatxcxLogin(code).then( res => {
          if(res.data.code==0){
            this.setData({
              'openid':res.data.data.openid,
              'session_key': res.data.data.session_key,
              // ['wxPhnoe.wechatKey']: res.data.data.openid
            })
            wx.setStorageSync('openid', res.data.data.openid)
          }
        })
      }
    })
  },
  getPhoneNumber: function (e) {
      var ivObj = e.detail.iv
      var telObj = e.detail.encryptedData
      var codeObj = "";
      var that = this;
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        let obj = {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          session_key: that.data.session_key
        }
        api.wechatlogin(obj).then(res => {
          if (res.data.code == 0) {
            this.setData({
              ['wxPhnoe.phone']: res.data.data
            })
            if(this.data.wxPhnoe.wechatKey && this.data.wxPhnoe.phone) {
              api.xcxbind(this.data.wxPhnoe).then(res => {
                if (res.data.code == 0) {
                  wx.setStorageSync('y-token', res.data.data.token);
                  wx.reLaunch({
                    url: "../index/index"
                  })
                }
              })
            }
          } else {
            wx.showToast({
              title: ret.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        wx.showToast({
          title: '登陆失败',
          icon: 'none',
          duration: 1000
        })
      }
  },
  uses(e){
      wx.getUserInfo({
        success: res => {
          var _this = this
          if (e.detail.errMsg == "getUserInfo:ok") {
            let obj = {
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              session_key: _this.data.session_key
            }
            api.getUnionid(obj).then(res => {
              if (res.data.code == 0) {
                this.setData({
                  ['wxPhnoe.wechatKey']: res.data.data
                })
                if (this.data.wxPhnoe.wechatKey && this.data.wxPhnoe.phone) {
                  api.xcxbind(this.data.wxPhnoe).then(res => {
                    if (res.data.code == 0) {
                      wx.setStorageSync('y-token', res.data.data.token);
                      wx.reLaunch({
                        url: "../index/index"
                      })
                    }
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '登陆失败',
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
  },
  //去注册
  toRegister:function(){
    wx.navigateTo({
      url: "../register/register"
    })
  },
  //获取验证码
  getCode: function () {
    let that = this
    this.setData({
      ['phoneCode.phone']: that.data.phoneCode.phone
    })
    //验证手机号
    let phone = this.data.phoneCode.phone
    console.log(phone,4444)
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
        ajxtrue: true,
        ['loginData.phone']: phone
      })
      api.getLoginCode(this.data.phoneCode).then(res => {
        console.log(res,1122)
        if (res.data.code == 0) {
          wx.showToast({
            title: '验证码发送成功',
            icon: 'success',
            duration: 1000
          })
          this.setData({
            getCode: false
          })
          // wx.setStorageSync('loginCode', res.data.data.replace(/[^0-9]/ig, ""))
          this.countDown()
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
    //发送手机验证码
    // if (this.data.ajxtrue) {
    //   api.getLoginCode(this.data.phoneCode).then(res => {
    //     console.log(res,1122)
    //     if (res.data.code == 0) {
    //       wx.showToast({
    //         title: '验证码发送成功',
    //         icon: 'success',
    //         duration: 1000
    //       })
    //       this.setData({
    //         getCode: false
    //       })
    //       // wx.setStorageSync('loginCode', res.data.data.replace(/[^0-9]/ig, ""))
    //       this.countDown()
    //     } else {
    //       wx.showToast({
    //         title: res.data.msg,
    //         icon: 'none',
    //         duration: 1000
    //       })
    //     }
    //   })
    // } else {
    //   console.log(this.data.ajxtrue,7777)
    //   wx.showToast({
    //     title: '请输入正确的手机号12',
    //     icon: 'none',
    //     duration: 1000
    //   })
    // }


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
  }
})