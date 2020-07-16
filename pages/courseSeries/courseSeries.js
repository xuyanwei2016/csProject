//获取应用实例 
const app = getApp()
const api = require("../../api/course.js").API

Page({
  data: {
    dataList: [],
    listQuery: {
      pageNum: 1,
      pageSize: 20
    },
    totalPage: 0,
    otherImageUrl: app.otherImageUrl,
    imageUrl: app.imageUrl,
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
    wx.showLoading({ title: '加载中' })
    api.seriesCourseAPI(this.data.listQuery).then(res => {
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
          isNull: list && list.length > 0 ? false : true,
          isLast: res.data.data.pages == this.data.listQuery.pageNum ? true : false
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
  courseDet(e) {//课程详情 3课程5视频6音频
    console.log(e)
    wx.navigateTo({
      url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name
    })
  }
})