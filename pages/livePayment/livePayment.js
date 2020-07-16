//获取应用实例 
const app = getApp()
const api = require("../../api/live.js").API
const utils = require("../../utils/util.js")

Page({
  data: {
    liveImg: app.liveImg,
    pageData:{},
    isIphoneX: false,
    id:'',
  },
  onLoad: function (options) {
    this.setData({
      id:options.id,
      isIphoneX: app.isIphoneX()
    })
    this.getDet()
  },
  getDet() {
    api.getDetPayAPI(this.data.id).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          pageData: res.data.data
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
  payBtn() { //立即支付
    if (!wx.getStorageSync('y-token')) {
      this.setData({
        ifLogin: false
      })
    } else {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  goLive(e) {
    wx.navigateTo({
      url: "../liveDet/liveDet?id=" + e.currentTarget.dataset.id
    })
  },
  wxLogin() {
    let query = {
      goodsList: [
        {
          goodsType: 7, //直播
          goodsid: this.data.listQuery.oid,
          num: 1,
          salesPrice: this.data.pageData.salesPrice
        }
      ],
      payType: 1, //支付类型 0支付宝1微信2易宝支付 ,
      wechatPayType: 0 //微信支付类型 0公众号支付1扫码支付2app支付
    }
    let object = utils.payment(query)
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
      loginApi.wechatlogin(obj).then(res => {
        console.log(res, 8888)
        if (res.data.code == 0) {
          let obj = {
            phone: res.data.data,
          }
          loginApi.upPhone(obj).then(res => {
            if (res.data.code == 0) {
              wx.setStorageSync('y-token', res.data.data.token);
              wx.reLaunch({
                url: "../index/index"
              })

            }
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
})