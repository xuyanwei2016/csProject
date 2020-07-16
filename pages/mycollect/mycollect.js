var app = getApp()
const api = require("../../api/collect.js").API
const apiCollect = require("../../api/course.js").API

Page({
  data: {
    pageList: [],
    listQuery: {
      pageNum: 1,
      pageSize: 20,
    },
    urlPath: app.otherImageUrl,
  },
  onLoad: function (options) {
    this.getList()
  },
  getList() {//资源列表
    wx.showLoading({
      title: '玩命加载中',
    })
    api.getListAPI(this.data.listQuery).then(res => {
      if(res.data.code==0){
        let list = []
        if (this.data.pageList && this.data.pageList.length > 0) {
          list = this.data.pageList.concat(res.data.data.list)
        } else {
          list = res.data.data.list
        }
        if(list){
          list.forEach((res, idx) => {
            list[idx].isTouchMove = false
          })
        }
        this.setData({
          pageList:list,
          totalPage: res.data.data.total,
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          duration: 2000
        })
      }
      wx.hideLoading();
    })
  },
  onReachBottom: function () {  //页面上拉触底事件的处理函数
    if (this.data.pageList.length < this.data.totalPage) {
      let currentNum = this.data.listQuery.pageNum + 1
      let pageNum = 'listQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getList()
    } else {
      wx.showToast({
        title: '已加载全部数据',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    let data = app.touch._touchstart(e, this.data.pageList)
    this.setData({
      pageList: data
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    let data = app.touch._touchmove(e, this.data.pageList)
    this.setData({
      pageList: data
    })
  },
  del: function (e) { //删除事件
    let that = this
    let data = {
      id: e.currentTarget.dataset.id,
      type: e.currentTarget.dataset.type
    }
    let arr = []
    arr.push(data)
    wx.showModal({
      title: '提示',
      content: '确认要取消收藏此条信息么？',
      success: function (res) {
        if (res.confirm) { //确认取消收藏
          apiCollect.cancelFavAPI({goodsList: arr}).then(res => {
            if(res.data.code==0){
              wx.showToast({
                title: '取消收藏成功',
                icon: 'none',
                duration: 1000
              })
              that.setData({
                'pageList':[]
              })
              that.getList()
            }else{
              wx.showToast({
                title: '取消收藏失败'+res.data.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    })
  },
  toDetails(e) {  //跳转详情页面
    if (e.currentTarget.dataset.type == '3') {//课程详情
      wx.navigateTo({
        url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == '5') {//视频详情
      wx.navigateTo({
        url: "../videoDet/videoDet?id=" + e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == '6') {//音频详情
      wx.navigateTo({
        url: "../audioDet/audioDet?id=" + e.currentTarget.dataset.id
      })
    }
  }
})