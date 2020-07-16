//获取应用实例 
const app = getApp()
const api = require("../../api/course.js").API

Page({
  data: {
    navList: [
      { text: '听解读', url: 'nav_listen'},
      { text: '系列课', url: 'nav_course'},
      { text: '直播课', url: 'nav_live'}, 
    ],
    freeList: [],
    excellentList: [],
    goodList:[],
    freeQuery: { //免费课程
      pageNum: 1,
      pageSize: 4,
      code: null,
    },
    excellentQuery: {//精品课程
      pageNum: 1,
      pageSize: 4,
      code: null,
    },
    goodQuery: {//好课课程
      pageNum: 1,
      pageSize: 4,
      code: null,
    },
    otherImageUrl: app.otherImageUrl,
    imageUrl: app.imageUrl,
  },
  onLoad: function (options) {
    this.getFreeCourse('WX_home02') //免费课程
    this.getFreeCourse('WX_home03') //精品课程
    this.getFreeCourse('WX_home04') //好课课程
  },
  getFreeCourse(code) {//免费课程
    if (code == 'WX_home02'){//免费课程
      let freeCode = 'freeQuery.code'
      this.setData({
        [freeCode]: code
      })
      this.getData(this.data.freeQuery)
    }
    if (code == 'WX_home03') {//精品课程
      let freeCode = 'excellentQuery.code'
      this.setData({
        [freeCode]: code
      })
      this.getData(this.data.excellentQuery)
    }
    if (code == 'WX_home04') {//好课课程
      this.setData({
        ['goodQuery.code']: code
      })
      this.getData(this.data.goodQuery)
    }
  },
  getData(data) {
    api.freeCourseAPI(data).then(res => {
      if (res.data.code == 0) {
        if (data.code == 'WX_home02') {//免费课程
          this.setData({
            freeList: res.data.data.list
          })
        } else if (data.code == 'WX_home03') {//精品课程
          this.setData({
            excellentList: res.data.data.list
          })
        } else {//好课课程
          this.setData({
            goodList: res.data.data.list
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
  myList(e) {
    if (e.detail.code == 'WX_home02'){ //免费课程
      wx.navigateTo({
        url: "../courseFree/courseFree"
      })
    }
    else if (e.detail.code == 'WX_home03') { //精品小课
      wx.navigateTo({
        url: "../courseExcellent/courseExcellent"
      })
    }
    else if (e.detail.code == 'WX_home04') { //好课推荐(系列课列表)
      wx.navigateTo({
        url: "../courseSeries/courseSeries"
      })
    }
  },
  resourcePage(e){
    if (e.currentTarget.dataset.query == '听解读'){
      wx.navigateTo({
        url: "../courseList/courseList"
      })
    } else if (e.currentTarget.dataset.query == '系列课') {
      wx.navigateTo({
        url: "../courseSeries/courseSeries"
      })
    } else{
      wx.navigateTo({
        url: "../liveList/liveList"
      })
    }
  },
  courseDet(e) {//课程详情 3课程5视频6音频
    if (e.currentTarget.dataset.type == 3){//课程详情
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
})