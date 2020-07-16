// components/dialog/dialog.js
var app = getApp()
const myApi = require("../../api/my.js").API
const api = require("../../api/common.js").API
const loginApi = require("../../api/login.js").API

Component({
  behaviors: [],
  properties: {//组件的属性列表
    vipList: {
      type: Array
    }
  },
  data: {
    dialog:false,
    imageUrl: app.imageUrl,
    imgPath: app.requestUrl,
    currentId:null,
    currentPrice:null,
    vipList: [],
    memberImg:null,
    memberName:null,
    isModel:false,
    openid:null,
    session_key:null,
  },
  attached: function() {
    myApi.getMemberAPI().then(res => {
      if (res.data.code == 0) {
        this.setData({
          phone: res.data.data.phone,
          memberImg: res.data.data.img,
          memberName: res.data.data.account
        })
      }
    })
    this.getVip()
  },
  methods: {//组件的方法列表
    getVip() { //获取vip服务
      api.getVipAPI().then(res => {
        if (res.data.code == 0) {
          this.setData({
            vipList: res.data.data,
            currentId: res.data.data[0].id,
            currentPrice: res.data.data[0].sellprice
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    changePrice(e) { //点击改变背景色
      let id = e.currentTarget.dataset.id
      let sellPrice = e.currentTarget.dataset.sell
      this.setData({
        currentId: id,
        currentPrice: sellPrice
      })
    },
    show() { //显示弹窗
      this.setData({
        dialog: true
      })
    },
    close() { //关闭弹窗
      this.setData({
        dialog: false
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
    getOrder() { //生成订单
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
            'success':function(res){
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
    payBtn() {//立即支付按钮
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
  },
})