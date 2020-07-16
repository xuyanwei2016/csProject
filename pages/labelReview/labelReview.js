//获取应用实例 
const app = getApp()
const api = require("../../api/label.js").API

Page({
  data: {
    navList: [
      { text: '案例', url: 'nav_case', type: '32' },
      { text: '问答', url: 'nav_anwser', type: '35' },
      { text: '法规', url: 'nav_law', type: '34' },
      { text: '实操', url: 'nav_operation', type: '33' }
    ],
    listQuery: {
      pageNum: 1,
      pageSize: 20,
      oid: 0,
      name: null,
      resourceType: 31
    },
    labelId: null,
    courseList: [],
    subjectList: [],
    recommendList: [],
    otherImageUrl: app.otherImageUrl,
    imageUrl: app.imageUrl,
    totalPage: 0,
  },
  onLoad: function (options) {
    console.log(this.data.imageUrl,44455)
    wx.setNavigationBarTitle({ title: options.name })
    this.setData({
      labelId: options.id,
      ['listQuery.oid']: options.id,
      ['listQuery.name']: options.name
    })
    this.getCourse() //推荐课程
    this.getSubject() //大咖说说（推荐主题）
    this.getRecommend() //推荐阅读
  },
  onReachBottom: function () {//分页
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      let pageNum = 'listQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getRecommend() //推荐阅读
     }
  },
  getCourse() { //课程推荐
    api.labelDetCourseAPI({label:this.data.labelId}).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          courseList: res.data.data 
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
  courseDet(e) {
    if (e.currentTarget.dataset.type == 3) {//课程详情
      wx.navigateTo({
        url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == 5) {//视频详情
      wx.navigateTo({
        url: "../videoDet/videoDet?id=" + e.currentTarget.dataset.id
      })
    } else if (e.currentTarget.dataset.type == 6) {//音频详情
      wx.navigateTo({
        url: "../audioDet/audioDet?id=" + e.currentTarget.dataset.id
      })
    }
  },
  getSubject() {//大咖说说（推荐主题）
    api.labelDetSubAPI({ labelContentId: this.data.labelId }).then(res => {
      if (res.data.code == 0) {
        if (res.data.data.length && res.data.data.length>4){ //最多推荐四条
          let data = []
          res.data.data.forEach(function (item, index) {
            if(index<=3){
              data.push(item)
            }
          })
          this.setData({
            subjectList: data
          })
        } else{
          this.setData({
            subjectList: res.data.data
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  subjectDetails(e) {//大咖说说详情页
    var id = e.currentTarget.dataset.id //获取id值
    var template = e.currentTarget.dataset.template //获取template值
    if (template == 1) {
      wx.navigateTo({
        url: '../specialDetails/specialDetails?oid=' + id +"&name=大咖说税"
      })
    } else if (template == 2) {
      wx.navigateTo({
        url: '../specialList/specialList?oid=' + id,
      })
    }
  },
  // 点击跳转至资源列表页
  resourceItem: function () {
    wx.navigateTo({
      url: "../search/search"
    })
  },
  getRecommend() {//推荐阅读
    wx.showLoading({ //加载中
      title: '加载中',
    })
    api.labelDetReadAPI(this.data.listQuery).then(res => {
      if (res.data.code == 0) {
        var list = []
        if (this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data.resList
        } else {
          list = this.data.recommendList.concat(res.data.data.resList)
        }
        this.setData({
          recommendList: list,
          totalPage: res.data.data.pageCount
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.hideLoading();// 隐藏加载框
    })
  },
  goDetails(e) {
    let oid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../articleDet/articleDet?id="+oid
    })
  },
  labelPage(e) {//案例-问答-法规-实操
    let resourceType = e.currentTarget.dataset.type
    let title = e.currentTarget.dataset.title
    let oid = this.data.listQuery.oid
    let name = this.data.listQuery.name
    wx.navigateTo({
      url: "../labelDetails/labelDetails?oid=" + oid + "&name=" + name + "&resourceType=" + resourceType + "&title="+title
    })
  },
  calculator() {
    wx.navigateTo({
      url: "../calculator/calculator"
    })
  },
})