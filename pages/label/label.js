// pages/label/label.js
var app = getApp()
const api = require("../../api/label.js").API
Page({
  data: {
    labelList:[],
    imageUrl: app.imageUrl,
  },
  // 点击跳转详情
  detailsBind: function (e) { 
    wx.navigateTo({
      url: '../labelReview/labelReview?name=' + e.currentTarget.dataset.title + '&id=' + e.currentTarget.dataset.oid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getLabelList()
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

  },
  getLabelList(){
    wx.showLoading({ //加载中
      title: '加载中',
    })
    let that = this
    api.getLabelListPAI().then(res => {
      if (res.data.status) {
        that.setData({ 
          labelList: res.data.data.list ,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
    wx.hideLoading();// 隐藏加载框
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