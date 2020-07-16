//index.js
//获取应用实例 
const app = getApp()
const api = require("../../api/index.js").API
const apiCourse = require("../../api/course.js").API

Page({
  data: {
    adsList: [],
    recommendList: [],
    count:null, //消息数量
    adsForm: {
      signValue:"app_1",
      num:8
    },
    listQuery: {
      pageNum: 1,
      pageSize: 10,
      code: 'PC_home03'
    },
    pageQuery:{
      pageNum:1,
      pageSize: 20,
      code: 'PC_home04'
    },
    otherImageUrl: app.otherImageUrl,
    imageUrl: app.imageUrl,
    liveImg: app.liveImg,
    navList:[
      { text: '个税', url: 'nav_gs' },
      { text: '增值税', url: 'nav_zzs' }, 
      { text: '房地产', url: 'nav_fdc' },
      { text: '建筑', url: 'nav_jz' },
      { text: '国际税收', url: 'nav_gjss' },
      { text: '行政事业单位', url: 'nav_xzsy' },
      { text: '企业所得税', url: 'nav_qy' },
      { text: '更多', url: 'nav_more' },
    ],
    courseList: [],
    hasNextPage:false,
    specialList: [], //精选专题
    exampleList: [], //实操实例
    liveList:[], //直播推荐位
    liveQuery:{
      pageNum: 10,
      pageSize: 1,
      code: 'WX_home01',
    },
    liveText:['立即预约','立即观看','查看回放'],
    liveTip:['','live','预告','结束']
  },
  onReady: function () {

  },
  onShow: function () {
    this.getAds()  //获取轮播图
    this.getCourse() //热门课程
    this.getRecommend()
    // this.getMessage()
    this.getArticle()
    this.getLive() //推荐直播
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        console.log(445566)
        wx.login() //重新登录
      }
    })
  },
  labelPage(e) { //标签--列表
    let type = e.currentTarget.dataset.query
    if (type == '更多') {
      wx.navigateTo({
        url: "../label/label"
      })
    } else {
      api.getlabelId({ labelContent: type }).then(res => {//获取标签id
        if (res.data.code == 0) {
          if (res.data.data.id) {
            wx.navigateTo({
              url: "../labelReview/labelReview?id=" + res.data.data.id + "&name=" + type
            })
          } else {
            wx.showToast({
              title: '暂无数据',
              icon: 'loading',
              duration: 1000
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
    }
  },
  getAds() { //获取轮播图
    api.getAdsList(this.data.adsForm).then(res => {
      if (res.data.code == 0) {
        this.setData({
          adsList: res.data.data
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
  getCourse() {//热门课程
    api.getCourseList().then(res =>{
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
  coursePage(){ //跳转课程列表 --- 系列课
    wx.navigateTo({
      url: "../courseSeries/courseSeries"
    })
  },
  courseDetails(e) {//跳转课程详情页面
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../courseDet/courseDet?id="+id
    })
  },
  toUrl: function(e) {//轮播图跳转
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  resourceItem: function () {// 点击跳转至资源列表页
    wx.navigateTo({
      url: "../search/search"
    })
  },
  goDetails(e) {//实操案例详情页面--文章详情
    wx.navigateTo({
      url: '../articleDet/articleDet?id=' + e.detail.id,
    })
  },
  specialItem: function () {// 点击跳转至专题列表页
    wx.navigateTo({
      url: '../special/special',
    })
  },
  resourcePage: function(e) { //点击跳转至资源列表页
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: '../resource/resource?resourceType=' + type,
    })
  },
  goSpecialDetails: function(e) { //跳转至专题详情
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let type = e.currentTarget.dataset.type
    if(type==1) {
      wx.navigateTo({
        url: '../specialDetails/specialDetails?oid=' + id + '&name=' + name,
      })
    } else {
      wx.navigateTo({
        url: '../specialList/specialList?oid='+id+'&name='+name,
      })
    }
    
  },
  livePage() { //更多
    wx.navigateTo({
      url: '../liveList/liveList',
    })
  },
  getLive() { //推荐直播
    apiCourse.freeCourseAPI(this.data.liveQuery).then(res => {
      if (res.data.code == 0) {
        this.setData({
          liveList: res.data.data.list
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
  liveDeatils(e) {
    console.log(e,77888)
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let messageCode = e.currentTarget.dataset.code
    // if (id) {
      // if (type == '0') {//预约
        // wx.navigateTo({
        //   url: "../liveDet/liveDet?id=" + e.currentTarget.dataset.liveid
        // })
      // }
      // if (type == '1') {//观看
        // if (messageCode) {//没有权限
          wx.navigateTo({
            url: "../livePayment/livePayment?id=" + id
          })
        // } else {//有权限
          // wx.navigateTo({
          //   url: "../liveDet/liveDet?id=" + e.currentTarget.dataset.liveid
          // })
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
  getRecommend() { //获取推荐位 ---精选专题
    api.getRecommendAPI(this.data.listQuery).then(res => {
      if (res.data.code == 0) {
        if (res.data.data.recommendResourceList.list.length>4) {
          this.setData({
            specialList: res.data.data.recommendResourceList.list.slice(0,4)
          })
        } else {
          this.setData({
            specialList: res.data.data.recommendResourceList.list
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
  getArticle(){//实操案例
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    api.getRecommendAPI(this.data.pageQuery).then(res => {
      if (res.data.code == 0) {
        var list = []
        if (this.data.pageQuery.pageNum == 1) { //第一页
          list = res.data.data.recommendResourceList.list
        } else {
          list = this.data.exampleList.concat(res.data.data.recommendResourceList.list)
        }
        this.setData({
          exampleList: list,
          hasNextPage: res.data.data.recommendResourceList.hasNextPage
        })
      }else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  onReachBottom() {//实操案例分页
    if (this.data.hasNextPage) {//判断是否有下一页
      let currentNum = this.data.pageQuery.pageNum + 1
      let pageNum = 'pageQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getArticle()
    }
  },
  onShareAppMessage: function (options) {//分享
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
  },
})
