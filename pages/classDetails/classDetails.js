const api = require("../../api/resourceDetails.js").API
const apis = require("../../api/common.js").API
const apiVideo = require("../../api/video.js").API
const reviewAPI = require("../../api/review.js").API
var app = getApp()

Page({
  data: {
    detailsId: null,
    pageData:{},
    intro: null,
    isOpen: false,
    urlPath: app.imageUrl,
    imgPath: app.requestUrl,
    reviewTotal:null,
    reviewData:[],
    isIphoneX: false,
    reviewType: 'smclass',
    name: '',
    liveImg: app.liveImg,
    poster: '',
    listNull:'',
    content: null,
    videoSrc: '',
    ifLogin: false
  },
  onReady: function() {
    // 获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function (options) {// 生命周期函数--监听页面加载
    this.setData({
      detailsId : options.id,
      isIphoneX: app.isIphoneX(),
    })
    this.getDetails()
  },
  onShow: function () { // 生命周期函数--监听页面显示
    if (this.data.detailsId && this.data.pageData.resourceType){
      this.getReviewList()
    }
  },
  btnClick() { //点击按钮判断是否登录
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    } else {
      this.dialog.show()
    }
  },
  getDetails() {//获取微课详情
    let that = this
    wx.showLoading({ //加载中
      title: '加载中',
    })
    api.getClassDetails(this.data.detailsId).then(res=>{
      if (res.data.code == 0) {
        this.setData({
          pageData: res.data.data,
          name: res.data.data.name,
          content: res.data.data.synopsis ? res.data.data.synopsis.replace(/\<img/gi, '<img style="max-width:100%;height:auto"') : ''
        })
        //获m3u8格式的视频
        apiVideo.getVideoOtherAPI({ fileName: this.data.pageData.video }).then(res => {
          if (res.data.code == 0) {
            this.setData({
              videoSrc: res.data.data,
            })
          }
        })
        let names = this.data.name && this.data.name.length > 10 ? this.data.name.substring(0, 10) + '...' : this.data.name
        // 顶部标签名称
        wx.setNavigationBarTitle({ title: names })
        if (that.data.pageData.cover) {
          that.setData({
            poster: that.data.urlPath + '?fileName=' + that.data.pageData.cover
          })
        } else {
          that.setData({
            poster: that.data.liveImg + that.data.pageData.defaultCover
          })
        }
        if (this.data.pageData.synopsis.length>60){
          this.setData({
            intro: this.data.pageData.synopsis.substr(0,60)+'......',
            isOpen: true
          })
        }
        this.getReviewList() //获取评论列表
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
      wx.hideLoading();// 隐藏加载框
    })
  },
  getReviewList() {//获取评论列表
    let data = {
      pageSize: 5,
      pageNum: 1,
      resourceId: this.data.detailsId,
      resourceType: this.data.pageData.resourceType,
    }
    api.getReview(data).then(res => {
      if (res.data.code == 0) {
        this.setData({
          reviewData: res.data.data.list,
          reviewTotal: res.data.data.total,
          listNull: res.data.data.list && res.data.data.list.length > 0 ? false : true,
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
  myList(e) {//点赞 --- icon实现
    let that = this
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
  },
  openIntro(){//展开收起简介
    let that = this
    this.setData({
      isOpen: !that.data.isOpen
    })
  },
  addReview() {//去评论
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    } else{
      wx.navigateTo({
        url: "../addReview/addReview?resourceType=" + this.data.pageData.resourceType + "&resourceId=" + this.data.detailsId +"&resourceName=" +this.data.pageData.name
      })
    }
  },
  videTap() {//查看无权限视频
    let that = this
    wx.showToast({
      title: that.data.pageData.message,
      icon: 'none',
      duration: 2000
    })
  },
  reviewDetails() {//全部评论页面
    wx.navigateTo({ //跳转
      url: "../comments/comments?resourceType=" + this.data.pageData.resourceType + "&resourceId=" + this.data.detailsId +"&resourceName=" + this.data.pageData.name
    })
  },
  onShareAppMessage: function (options) {//用户点击右上角分享
    return {
      title: '财税专家',
      success: function (shareTickets) {
        console.info(shareTickets + '成功');
        // 转发成功
      },
      fail: function (res) {
        console.log(res + '失败');
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    }
  }
})