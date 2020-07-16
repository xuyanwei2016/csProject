var app = getApp()
const api = require("../../api/review.js").API
const apiCourse = require("../../api/course.js").API
const apiPost = require("../../api/post.js").API

Page({
  data: {
    urlPath: app.imageUrl,
    info: {},
    defaultData: [
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
    ],
    list: [],
    dialog: false,
    content: null, //input-value
    faName: null,
    faId: null,
    isIphoneX: false,
    focus: false,
    type: null,
    replyHide: false,
    postId:null,
    reviewId: null,
    replyQuery:{
      pageSize: 1000,
      pageNum:1,
      oid:'',
    },
  },
  onLoad: function (options) {//生命周期函数--监听页面加载
    this.setData({
      postId: options.postId,
      reviewId: options.id,
      type: options.type,
      isIphoneX: app.isIphoneX(),
      ['replyQuery.oid']: options.id
    })
    this.getData()//评论详情
  },
  getData() { //获取详情
    if (this.data.type == 'forum') { //发帖评论详情
      api.forumReviewDet({oid:this.data.reviewId}).then(res => {
        if (res.data.code == 0) {
          this.setData({
            info: res.data.data,
            list: res.data.data.replyVoList.list
          })
        } else{
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else if (this.data.type == 'course' || this.data.type == 'video' || this.data.type == 'audio'){//课程评论
      api.reviewCourseDetails(this.data.reviewId).then(res => {
        if (res.data.code == 0) {
          this.setData({
            info: res.data.data,
            list: res.data.data.replyVoList
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 2000
          })
        }
      })
    } else if (this.data.type == "smclass"){ //微课
      api.reviewDetails(this.data.reviewId).then(res => {
        if (res.data.code == 0) {
          this.setData({
            info: res.data.data,
            list: res.data.data.replyVoList
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
  replyInput() {//回复弹窗
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    } else{
      this.setData({
        focus: true,
        faName: '',
        faId: '',
        content:'',
        replyHide: true,
      })
    }
  },
  changeReview(e) {//change-input
    this.setData({
      content: e.detail.value
    })
  },
  reviewIcon(e) {//回复按钮
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../../pages/login/login'
      })
    } else {
      this.setData({
        focus: true,
        faName: e.currentTarget.dataset.name,
        faId: e.currentTarget.dataset.id,
        replyHide: true,
        content: ''
      })
    }
  },
  handleReply() {//回复主题
    this.setData({
      focus: true,
      faName: '',
      faId: '',
      content: '',
      replyHide: true
    })
  },
  sendMsg(e) {//回复
    if (this.data.content) {
      if(this.data.type == 'forum') {//帖子回复
        let data = {
          content: this.data.content,
          fatherId: this.data.info.id,//fatherId(integer, optional): 父级评论id：0资源，其他评论id,
          fatherName: this.data.info.userName,//fatherName(string, optional): 父级评论用户名,
          mainId: this.data.postId, //帖子Id
        }
        if (this.data.faName && this.data.faId) {
          data.fatherName = this.data.faName
          data.fatherId = this.data.faId
        }
        apiPost.sendPostAPI(data).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '回复成功',
              icon: 'none',
              duration: 2000
            })
            this.getData()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 2000
            })
          }
        })
      } else if (this.data.type == 'course' || this.data.type == 'video' || this.data.type == 'audio') {//资源回复
        let data = {
          content: this.data.content,
          fatherId: this.data.info.id,//fatherId(integer, optional): 父级评论id：0资源，其他评论id,
          fatherName: this.data.info.userName,//fatherName(string, optional): 父级评论用户名,
          mainId: this.data.reviewId, //最父级Id
          resourceId: this.data.postId, //课程id
          resourceType: 3 //课程3音频传6视频5
        }
        if (this.data.faName && this.data.faId) {
          data.fatherName = this.data.faName
          data.fatherId = this.data.faId
        }
        api.saveReview(data).then(res => {//回复
          if (res.data.code == 0) {
            wx.showToast({
              title: '回复成功',
              icon: 'none',
              duration: 1000
            })
            this.getData()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else{//微课评论
        let params = {
          content: this.data.content, //content(string, optional): 评论内容
          mainId: this.data.reviewId, //mainId(integer, optional): 所属主评论id：0资源主评论，其他主评论id,
          fatherId: this.data.reviewId,//fatherId(integer, optional): 父级评论id：0资源，其他评论id,
          fatherName: this.data.info.userName,//fatherName(string, optional): 父级评论用户名,
          resourceId: this.data.info.resourceId,//resourceId(string, optional): 资源id,
          resourceName: this.data.info.resourceName,//resourceName(string, optional): 资源名称,
          resourceType: this.data.info.resourceType,//resourceType: 资源类型 0全部1图书 31文章 23案例 33实操技能 34法规 35问答 2微课 3专题 100资讯,
          score: 0,//score(integer, optional): 评分
        }
        if (this.data.faName && this.data.faId) {
          params.fatherName = this.data.faName
          params.fatherId = this.data.faId
        }
        api.replySave(params).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '回复成功',
              icon: 'none',
              duration: 2000
            })
            this.getData()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'loading',
              duration: 2000
            })
          }
        })
      }
      this.setData({
        dialog: false,
        faName: null,
        faId: null,
        content: null,
        replyHide: false
      })
    } else {
      wx.showToast({
        title: '请填写回复内容',
        icon: 'none',
        duration: 2000
      })
    }
  },
  favListBtn(e){//点赞
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../../pages/login/login',
      })
    } else {
      if (e.currentTarget.dataset.type == 3 || e.currentTarget.dataset.type == 5 || e.currentTarget.dataset.type == 6) {//课程视频音频
        apiCourse.agreeAPI(e.currentTarget.dataset.id).then(res => {
          if (res.data.code == 0) {//点赞成功
            this.getData()//评论详情
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
      } else if(this.data.type == 'forum') {//帖子点赞
        apiPost.agreeAPI(e.currentTarget.dataset.id).then(res => {
          if (res.data.code == 0) {//点赞成功
            this.getData()//评论详情
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
      } else{//微课点赞
        let that = this
        api.agreeReview(e.currentTarget.dataset.id).then(res => {
          if (res.data.code == 0) {//点赞成功
            this.getData()//评论详情
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
    }
  },
  cancelBtn() {
    this.setData({
      dialog: false,
      content: null,
      replyHide: false
    })
  },
  hideBox() {
    this.setData({
      replyHide: false
    })
  },
})