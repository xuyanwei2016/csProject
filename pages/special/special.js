// pages/special/special.js
const app = getApp()
const api = require("../../api/special.js").API
const utils = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    specialList: [],
    totalPage:null,
    urlPath: app.imageUrl,
    listQuery: {
      pageNum: 1,
      pageSize: 5
    },
  },

  goDetails:function(e) {
    var id = e.currentTarget.dataset.id //获取id值
    let name = e.currentTarget.dataset.name
    var template = e.currentTarget.dataset.template //获取template值
    if(template == 1) {
      this.goSpecial('specialDetails',id,name)
    } else if(template == 2) {
      this.goSpecial('specialList',id,name)
    }
  },

  goSpecial:function(add,id,name) {
    wx.navigateTo({
      url: `../${add}/${add}?oid=` + id + '&name=' + name,
    })
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
    this.getList()
  },
  getList() { //专题列表
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.stopPullDownRefresh()
    let data = utils.clearObj(this.data.listQuery)
    api.getSpecialList(data).then(res => {
      if (res.data.code == 0) {
        var list = []
        if(this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data
        } else {
          list = this.data.specialList.concat(res.data.data)
        }
        this.setData({
          specialList: list
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.hideLoading();// 隐藏加载框
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
  onPullDownRefresh: function () { //下拉刷新
    let pageNum = 'listQuery.pageNum'
    this.setData({
      [pageNum]:1,
      specialList:[]
    })
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { //上拉加载
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})