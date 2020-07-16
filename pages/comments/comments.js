var app = getApp()
const api = require("../../api/review.js").API
const apis = require("../../api/course.js").API
const utils = require("../../utils/util.js")


Page({
  data: { //页面的初始数据
    listQuery:{
      resourceId: null,
      resourceType: null,
      resourceName: null,
      pageSize: 20,
      pageNum: 1
    },
    totalPage: null,
    reviewData:[],
    isIphoneX: false,
    reviewType: '',
    listNull:false,
  },
  onLoad: function (options) { // 生命周期函数--监听页面加载
    console.log(options, 1111)
    let name = options.name
    options.name && options.name.length > 10 ? name = options.name.substring(0, 10) + '...' : name = options.name
    // 顶部标签名称
    wx.setNavigationBarTitle({ title: name })
    this.setData({
      ['listQuery.resourceId']: options.resourceId,
      ['listQuery.resourceType']: options.resourceType,
      ['listQuery.resourceName']: options.resourceName,
      isIphoneX: app.isIphoneX()
    })
    if(this.data.listQuery.resourceType == 3){//课程
      this.setData({
        reviewType:'course'
      })
    }
    if (this.data.listQuery.resourceType == 5) {//视频
      this.setData({
        reviewType: 'video'
      })
    }
    if (this.data.listQuery.resourceType == 6) {//音频
      this.setData({
        reviewType: 'audio'
      })
    }
    if (this.data.listQuery.resourceType == 2) {//微课
      this.setData({
        reviewType: 'smclass'
      })
    }
    this.getList()
  },
  onShow: function () { // 生命周期函数--监听页面显示
    this.setData({
        ['listQuery.pageNum']:1
    })
    if (this.data.listQuery.resourceId && this.data.listQuery.resourceType) {
      this.getList()
    }
  },
  getList() {//获取数据
    wx.showLoading({ title: '加载中'})
    if (this.data.listQuery.resourceType == 2) {//微课
      api.getReview(this.data.listQuery).then(res => {
        if (res.data.code == 0) {
          var newData = []
          if (this.data.listQuery.pageNum == 1) { //第一页
            newData = res.data.data.list
          } else {
            newData = this.data.reviewData.concat(res.data.data.list)
          }
          this.setData({
            reviewData: newData,
            totalPage: res.data.data.pages,
            listNull: newData && newData.length > 0 ? false : true,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
        wx.hideLoading();// 隐藏加载框
      })
    } else {//其他资源
      apis.reviewAPI(this.data.listQuery).then(res => {
        if (res.data.code == 0) {
          let newData = []
          if (this.data.listQuery.pageNum == 1) { //第一页
            newData = res.data.data.list
          } else {
            newData = this.data.reviewData.concat(res.data.data.list)
          }
          this.setData({
            reviewData: newData,
            totalPage: res.data.data.pages,
            listNull: newData && newData.length > 0 ? false : true,
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
    }
  },
  onReachBottom: function () {//页面上拉触底事件的处理函数
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      this.setData({
          ['listQuery.pageNum']: currentNum
      })
      this.getList()
    }
  },
  myList(e) {//点赞 --- icon实现
    let that = this
    if (this.data.listQuery.resourceType == 2) {//微课
      reviewAPI.agreeReview(e.detail.id).then(res => {
        if (res.data.code == 0) {//点赞成功
          let data = that.data.reviewData
          data.forEach(function (item, index) {
            if (item.id == e.detail.id) {
              item.isAgree = 1
              item.fabulousNum = item.fabulousNum + 1
            }
          })
          that.setData({
            reviewData: data
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else{
      apis.agreeAPI(e.detail.id).then(res => {
        if (res.data.code == 0) {//点赞成功
          let data = that.data.reviewData
          data.forEach(function (item, index) {
            if (item.id == e.detail.id) {
              item.isAgree = 1
              item.fabulousNum = item.fabulousNum + 1
            }
          })
          that.setData({
            reviewData: data
          })
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      })
    }
  },
  reviewBtn() {//评论
    wx.navigateTo({
      url: "../addReview/addReview?resourceType=" + this.data.listQuery.resourceType + "&resourceId=" + this.data.listQuery.resourceId + "&resourceName=" + this.data.listQuery.resourceName
    })
  },
  
})