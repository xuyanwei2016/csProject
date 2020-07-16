// pages/specialList/specialList.js
const app = getApp()
const api = require("../../api/special.js").API

Page({

  /**
   * 页面的初始数据
   */
  data: {
    special:{},
    oid: null,
    selectId: null,
    navList: [],
    commList: [],
    mainList: [],
    urlPath:app.imageUrl,
    imgPath: app.requestUrl
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = options.name
    options.name && options.name.length>10? name = options.name.substring(0,10)+'...' : name = options.name
    // 顶部标签名称
    wx.setNavigationBarTitle({ title: name })
    this.setData({
      oid: options.oid
    })
    this.getDetails()
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
  getDetails() {
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:1000
    })
    api.getSpecialDetails(this.data.oid).then(res => {
      if(res.data.code == 0) {
        this.setData({
          special: res.data.data,
          navList: res.data.data.dmListVO,
          commList: res.data.data.pmrListVO
        })
        this.setData({
          selectId: this.data.navList[0].id
        })
        let id = this.data.navList[0].id
        let data = this.data.commList
        this.setVal(id,data)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  specialTap(e) { //点击导航
    this.setData({
      selectId: e.currentTarget.dataset.id
    })
    let data = this.data.commList
    this.setVal(e.currentTarget.dataset.id,data)
  },
  setVal(id,arr){
    let newArr = []
    arr.forEach(function (item, index) {
      if (item.diyModelId == id) {
        newArr.push(item)
      }
    })
    this.setData({
      mainList: newArr
    })
  },
  toDetails: function(e) {
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let name = e.currentTarget.dataset.name
    if(type == 1) {
      wx.showToast({
        title: '暂不支持图书阅读功能，请下载税可知APP或访问web端',
        icon: 'none',
        duration: 1000
      })
    } else if(type >= 31 && type <= 35) {
      wx.navigateTo({
        url: '../articleDet/articleDet?id='+id,
      })
    } else {
      wx.navigateTo({
        url: '../classDetails/classDetails?id='+id+'&name='+name,
      })
    }
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