// pages/member/member.js
var app = getApp()
const api = require("../../api/common.js").API
const apis = require("../../api/my.js").API
const loginApi = require("../../api/login.js").API

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vipList: [],
    currentId: null,
    account: '游客',
    avatarUrl: null,
    date: null,
    isVip: null,
    currentPrice: null,
    openid:'',
    isModel: false,
    session_key:'',
    urlPath: app.imageUrl,
    imageList:[
      { url: 'icon_resource', text: '海量资源' },
      { url: 'icon_discount', text: '专享折扣' },
      { url: 'icon_gift', text: '惊喜礼物' },
      { url: 'icon_logo', text: '尊贵标识' },
    ],
    openTxt: '开通'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getVip()
    this.getvipMember()
  },
  getVip() { //获取vip服务
    api.getVipAPI().then(res => {
      if(res.data.code == 0) {
        this.setData({
          vipList: res.data.data,
          currentId: res.data.data[0].id,
          currentPrice: res.data.data[0].sellprice
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
  getvipMember() {
    apis.getMemberAPI().then(res => {
      if (res.data.code == 0) {
        this.setData({
          account: res.data.data.account,
          avatarUrl: res.data.data.img,
          date: res.data.data.endTime ? res.data.data.endTime : '',
          isVip: res.data.data.vip
        })
        if(!this.data.isVip || this.data.isVip == 0) {
          this.setData({
            openTxt: '开通'
          })
        } else {
          this.setData({
            openTxt: '立即续费'
          })
        }
      }
    })
  },
  isPay() {//判断支付
    let that = this
    api.isPaymentAPI({oid: wx.getStorageSync('memberId')}).then(orderStuas => {
      if(orderStuas.data.data == 1){//支付成功
        wx.showToast({
          title: '支付成功',
          icon: 'none',
          duration:1000
        })
        this.getvipMember()
      } else{
        setTimeout(() =>{
          that.isPay()
        },2000)
      }
    })
  },
  getOrder() {
    let that = this
    let par = {
      id: this.data.currentId,
      openId: wx.getStorageSync('openid'),
      payType: '1',
      sellPrice: this.data.currentPrice,
      source: '3'
    }
    api.getOrderAPI(par).then(res => {
      if (res.data.code == 0) {
        const resData = JSON.parse(res.data.data.url)
        wx.setStorageSync('memberId', res.data.data.orderId)
        wx.requestPayment({
          'nonceStr': resData.nonceStr, //随机串 
          'package': 'prepay_id=' + resData.package,
          'paySign': resData.paySign, //微信签名
          'signType':resData.signType,         //微信签名方式：
          'timeStamp': resData.timeStamp, //时间戳，自1970年以来的秒数
          'success': function(res){
            if(res.errMsg == "requestPayment:ok"){
              that.isPay() //判断是否支付
            } else{
              wx.showToast({
                title: '支付失败，请稍后再试',
                icon: 'none',
                duration:1000
              })
            } 
          },
          'fail':function(res){},
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration:1000
        })
      }
    })
  },
  open() { //点击开通/续费
    this.setData({
      isModel: app.isModel()
    })
    if(this.data.isModel == true) {
      wx.showToast({
        title: '由于相关规定，ios功能暂不可用',
        icon: 'none',
        duration:1000
      })
    } else {
      if (!wx.getStorageSync('openid')) {
        wx.login({
          success: res => {
            let that = this;
            let code = { code: res.code }
            loginApi.wechatxcxLogin(code).then(res => {
              if (res.data.code == 0) {
                this.setData({
                  'openid': res.data.data.openid,
                  'session_key': res.data.data.session_key
                })
                wx.setStorageSync('openid', res.data.data.openid)
                this.getOrder()
              }
            })
          }
        })
      } else {
        this.getOrder()
      }
    }
  },
  changePrice(e) { //点击改变背景色
    let id = e.currentTarget.dataset.id
    let sellPrice = e.currentTarget.dataset.sell
    this.setData({
      currentId:　id,
      currentPrice: sellPrice
    })
  },
  goServerDel() {
    wx.navigateTo({
      url: '../serveDeal/serveDeal',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})