//获取应用实例 
const app = getApp()
const api = require("../../api/order.js").API

Page({
  data: {
    pageData:{},
    otherImageUrl: app.otherImageUrl,
    invoiceText: ['未开票', '开票完成', '已申请'],
    // invoiceType: ['个人', '公司'],
    // invoiceCon: ['商品明细', '商品类别'],
    listQuery:{
      id:'',
      orderType:''
    },
    discount: null //优惠价钱
  },
  onLoad: function (options) {
    this.setData({
      ['listQuery.id']: options.id,
      ['listQuery.orderType']: options.orderType,
    })
    this.getDetails()
  },
  onShow: function () {

  },
  getDetails() {
    api.orderDetAPI(this.data.listQuery).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          pageData: res.data.data
        })
        let price = this.data.pageData.payment - this.data.pageData.orderPayment
        this.setData({
          discount: price.toFixed(2)
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },

})