//获取应用实例 
const app = getApp()
const api = require("../../api/course.js").API

Page({
  data: {
    dataList:[],
    listQuery:{
      pageNum: 1,
      pageSize: 20
    },
    totalPage: 0,
    liveImg: app.liveImg,
    otherImageUrl: app.otherImageUrl,
    liveTip: ['', 'live', '预告', '结束'],
    isNull: '',
    isLast: '',
  },
  onLoad: function (options) {
    this.getList()
  },
  onReachBottom: function () {//分页
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      let pageNum = 'listQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getList() //列表
    }
  },
  getList() { //列表
    wx.showLoading({title: '加载中'})
    api.getLiveAPI(this.data.listQuery).then(res => {
      if (res.data.code == 0) {
        var list = []
        if (this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data.list
        } else {
          list = this.data.dataList.concat(res.data.data.list)
        }
        this.setData({
          dataList: list,
          totalPage: res.data.data.pages,
          isNull: list && list.length>0?false:true,
          isLast: res.data.data.pages == this.data.listQuery.pageNum?true:false
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.hideLoading()
    })
  },
  liveDet(e) {//直播详情
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let messageCode = e.currentTarget.dataset.code
    // if (id) {
      // if (type == '0') {//预约
        // wx.navigateTo({
        //   url: "../liveDet/liveDet?id=" + e.currentTarget.dataset.liveid
        // })
      // }
      // if (type == '1') {//观看live
        // if (messageCode) {//没有权限
          wx.navigateTo({
            url: "../livePayment/livePayment?id=" + id
          })
        // } else {//有权限
        //   wx.navigateTo({
        //     url: "../liveDet/liveDet?id=" + e.currentTarget.dataset.liveid
        //   })
        // }
      // }
    // } else {
    //   wx.showToast({
    //     title: '该直播不支持回放',
    //     icon: 'loading',
    //     duration: 2000
    //   })
    // }
  },
})