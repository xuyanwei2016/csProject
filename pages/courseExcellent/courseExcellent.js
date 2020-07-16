//获取应用实例 
const app = getApp()
const api = require("../../api/course.js").API

Page({
  data: {
    dataList: [],
    listQuery: {
      pageNum: 1,
      pageSize: 20,
      code: 'WX_home03',
    },
    totalPage: 0,
    otherImageUrl: app.otherImageUrl,
    imageUrl: app.imageUrl,
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
    api.freeCourseAPI(this.data.listQuery).then(res => {
      if (res.data.code == 0) {
        var list = []
        if (this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data.list
        } else {
          list = this.data.dataList.concat(res.data.data.list)
        }
        this.setData({
          dataList: list,
          totalPage: res.data.data.pages
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
  courseDet(e) {//课程详情 3课程5视频6音频
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
  },
})