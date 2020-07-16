var app = getApp()
const api = require("../../api/my.js").API
const api1 = require("../../api/login.js").API

Page({
  data: {
    ifMember:false,
    ifLogin:false,
    bind:false,
    account:'',
    avatarUrl:'',
    date:'',
    vip:'',
    loginData: {
      account: null,
      code: null,
      channel: null
    },
    openid: '',
    session_key: '',
    wxPhnoe: {
      channel: null,
      phone: null,
      wechatKey: null
    },
    urlPath: app.imageUrl,
    phone:null,
    open: true,
    firstPhone: null
  },
  onLoad: function (options) {
    this.getMember()
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let system = res.system;
        if (system.indexOf('Android') != -1) {
          that.setData({
            ['loginData.channel']: 2,
            ['wxPhnoe.channel']: 2
          })
        } else if (system.indexOf('iOS') != -1) {
          that.setData({
            ['loginData.channel']: 3,
            ['wxPhnoe.channel']: 3
          })
        }
      }
    })
  },
  toLoginPage:function(){
    wx.navigateTo({
      url: "../login/login"
    })
  },
  // toSet(){
  //   wx.navigateTo({
  //     url: "../set/set"
  //   })
  // },
  toBook(){
    wx.showToast({
      title: '功能暂未开放，敬请期待',
      icon: 'none',
      duration: 2000
    })
  },
  getMember() {
    if (wx.getStorageSync('y-token')){ 
      api.getMemberAPI().then( res => {
        if(res.data.code==0){
          this.setData({
            account: res.data.data.account,
            avatarUrl: res.data.data.img,
            vip: res.data.data.vip,
            date: res.data.data.endTime ? res.data.data.endTime:'',
            phone: res.data.data.phone,
            firstPhone:res.data.data.phone
          })
          let str = this.data.phone.match(/(\d{3})(\d{4})(\d{4})/).slice(1).reduce(
            function (value, item, index) {
              return index === 1 ? value + "****" : value + item;
            }
          )
          this.setData({
            phone: str
          })
        }
      })
      this.setData({
        ifLogin: true
      })
    } else {
      this.setData({
        ifLogin: false
      })
    }
    
  },
  listPage(e) {
    if (wx.getStorageSync('y-token')) {
      let name = e.currentTarget.dataset.name
      wx.navigateTo({
        url: "../"+name+'/'+name
      })
    } else {
      wx.navigateTo({
        url: "../login/login"
      })
    }
  },
  bindPhone() {
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  loginOut() { //退出登录
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认要退出登录吗？',
      success: function (res) {
        if (res.confirm) { //确认取消收藏
          api.loginOutAPI().then(res => {
            if(res.data.code==0){
              wx.showToast({
                title: '退出成功',
                icon: 'none',
                duration: 1000
              })
              wx.clearStorage()
              that.getMember()
            }
          })
        }
      }
    })
    
  },
  //微信登录
  wxLogin() {
    wx.login({
      success: res => {
        let that = this;
        let code = { code: res.code }
        api1.wechatxcxLogin(code).then(res => {
          if (res.data.code == 0) {
            this.setData({
              'openid': res.data.data.openid,
              'session_key': res.data.data.session_key,
              ['wxPhnoe.wechatKey']: res.data.data.openid
            })
          }
        })
      },
      fail: res => {
        let that = this
        that.setData({
          open: false
        })
      }
    })
  },
  getPhone: function (e) {
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
      api1.wechatlogin(obj).then(res => {
        if (res.data.code == 0) {
          that.setData({
            ['wxPhnoe.phone']: res.data.data
          })
          let objs = {
            phone: that.data.wxPhnoe.phone
          }
          if(that.data.ifLogin && this.data.firstPhone && objs.phone == this.data.firstPhone) {
            wx.showToast({
              title: '绑定成功',
              icon: 'none',
              duration: 1000
            })
            return
          }
          api1.upPhone(objs).then(ret => {
            if (ret.data.code == 0) {
              api.getMemberAPI().then(resMember => {
                console.log(resMember,'aabb')
                if(resMember.data.code == 0) {
                  that.setData({
                    ['wxPhone.phone']: resMember.data.phone
                  })
                }
              })
              wx.showToast({
                title: '绑定成功',
                icon: 'none',
                duration: 1000
              })
              this.getMember()
            } else {
              wx.showToast({
                title: ret.data.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '取消绑定',
        icon: 'none',
        duration: 1000
      })
    }
  }
})
