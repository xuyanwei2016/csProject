const api = require("../../api/article.js").API
// const orderApi = require("../../api/order.js").API
const loginApi = require("../../api/login.js").API
const apiVideo = require("../../api/video.js").API
var app = getApp()
const innerAudioContext = wx.createInnerAudioContext();

Page({
  data: {
    pageData: {},
    intro: null,
    isOpen: false,
    imageUrl: app.imageUrl,
    imgPath: app.requestUrl,
    reviewTotal: null,
    reviewData: [],
    isIphoneX: false,
    id: '',
    reviewType: 'course',
    relationQuery:{
      id:'',
      num:10
    },
    relationData:{},
    vipList: [],
    dialog: false,
    content:null,
    ifLogin: false,
    phone: null,
    openid: '',
    session_key: '',
    videoSrc: '',
    poster: '',
    commonUrl: app.commonUrl,
    showTime1: '00:00',
    showTime2: '00:00',
    isSeek: false,
    isPlayAudio: false,
    audioTime: 0,
  },
  onReady: function() {
    // 获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  oonUnload() {//离开页面
    innerAudioContext.destroy()
    clearInterval(this.data.durationIntval)
  },
  onLoad: function (options) {// 生命周期函数--监听页面加载
    this.setData({
      id: options.id,
      ['relationQuery.id']: options.id,
      isIphoneX: app.isIphoneX(),
    })
    if(!wx.getStorageSync('y-token')) {
      this.setData({
        ifLogin: false
      })
    } else {
      this.setData({
        ifLogin: true
      })
    }
    this.getDetails()
    this.getRelation()
  },
  onShow: function () { // 生命周期函数--监听页面显示
    if (this.data.id && this.data.pageData.types) {
      this.getDetails()
    }
  },
  getDetails() {//获取课程详情
    wx.showLoading({ //加载中
      title: '加载中',
    })
    api.getArticleDet(this.data.id).then(res => {
      let that = this
      if (res.data.code == 0) {
        this.setData({
          pageData: res.data.data,
          content: res.data.data.text ? res.data.data.text.replace(/\<img/gi, '<img style="max-width:100%;height:auto"') : ''
        })
        wx.hideLoading();// 隐藏加载框
        //获m3u8格式的视频
        apiVideo.getVideoOtherAPI({ fileName: this.data.pageData.video }).then(res => {
          if (res.data.code == 0) {
            this.setData({
              videoSrc: res.data.data,
            })
          }
        })
        if (that.data.pageData.cover) {//封面
          that.setData({
            poster: that.data.urlPath + '?fileName=' + that.data.pageData.cover
          })
        } else {
          that.setData({
            poster: that.data.liveImg + that.data.pageData.defaultCover
          })
        }
        //获取音频
        apiVideo.getAudioArtAPI({ fileName: this.data.pageData.audio }).then(audiores =>{//获取音频路径
          if (res.data.code == 0) {
            innerAudioContext.src = that.data.commonUrl + '/sc/' +audiores.data.data
          }
        })
        this.formatDuring(res.data.data.timeLength,'timesEnd') //总时间
        this.handleWatch()
      } else {
        wx.hideLoading();// 隐藏加载框
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getRelation() {//推荐文章
    api.getRelation(this.data.relationQuery).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          relationData: res.data.data
        }) 
        }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  handleWatch() {//监听音频事件
    let that = this
    setTimeout(() => { //初始化
      innerAudioContext.play();
      innerAudioContext.pause();
      var duration = innerAudioContext.duration;
    }, 1000);
    innerAudioContext.onEnded(() => {//播放结束
      clearInterval(that.data.durationIntval)
      this.setData({
        videoTimes: that.data.showTime2
      })
      wx.hideLoading()
    })
    // innerAudioContext.onPlay(() => {
    //   that.formatDuring(innerAudioContext.duration*1000,'timesEnd') //总时间
    // })
  },
  sliderChange(e) {//拖拉slider
    let that = this;
    let value = e.detail.value;//获取进度条百分比
    let times = parseInt((this.data.pageData.timeLength * value * 0.01) / 1000)
    this.setData({ audioTime: value });
    this.formatDuring(this.data.pageData.timeLength * value * 0.01, "timeStrat")
    innerAudioContext.seek(times);//调用seek方法跳转歌曲时间
    wx.showLoading({ //加载中
      title: '加载中',
    })
    that.setData({ isPlayAudio: true, isSeek: true }); //更改状态
    innerAudioContext.play();
    that.loadAudio()
  },
  playAudio() { //播放、暂停按钮
    let that = this
    this.setData({ isPlayAudio: !this.data.isPlayAudio }) //更改播放状态
    if (this.data.isPlayAudio) { //播放
      innerAudioContext.play();
      this.loadAudio()//计步器
    } else {
      innerAudioContext.pause(); //暂停。暂停后的音频再播放会从暂停处开始播放
      clearInterval(that.data.durationIntval)
    }
  },
  backBtn() {//倒退十五秒
    let that = this
    if (innerAudioContext.currentTime && innerAudioContext.currentTime > 15) {
      let newTime = innerAudioContext.currentTime - 15
      innerAudioContext.seek(newTime);//调用seek方法跳转歌曲时间
    } else {
      innerAudioContext.seek(0);//调用seek方法跳转歌曲时间
    }
    that.setData({ isPlayAudio: true, isSeek: true }); //更改状态
    wx.showLoading({ //加载中
      title: '加载中',
    })
    innerAudioContext.play();  //播放音频  
    that.loadAudio()
  },
  towardBtn() {//快进十五秒
    let that = this
    clearInterval(that.data.durationIntval)
    if (innerAudioContext.currentTime) {
      let newTime = innerAudioContext.currentTime + 15
      innerAudioContext.seek(newTime);//调用seek方法跳转歌曲时间
    } else {
      innerAudioContext.seek(15);//调用seek方法跳转歌曲时间
    }
    that.setData({ isPlayAudio: true, isSeek: true }); //更改状态
    wx.showLoading({ //加载中
      title: '加载中',
    })
    innerAudioContext.play();  //播放音频  
    that.loadAudio()
  },
  loadAudio() {
    var that = this;
    clearInterval(that.data.durationIntval)
    //设置一个计步器
    this.data.durationIntval = setInterval(function () {
      if (that.data.isPlayAudio == true) {//当歌曲在播放时执行
        if(that.data.isSeek) {
          that.setData({
            isSeek: false
          })
        } else{
          //设置播放时间
          that.formatDuring(innerAudioContext.currentTime * 1000+1000, 'timeStrat')
          //设置进度条
          let curTime = innerAudioContext.currentTime * 1000
          let persent = (curTime / that.data.pageData.timeLength) * 100
          that.setData({ audioTime: persent });
        }
        wx.hideLoading()
      }
    }, 1000);
  },
  goDetails(e) {//文章详情
    wx.navigateTo({
      url: "../articleDet/articleDet?id=" + e.currentTarget.dataset.id
    })
  },
  articlePdf(e) {//查看文章pdf
    if (!this.data.pageData.messageCode) {//判断是否有权限
      wx.navigateTo({
        url: "../pdfRead/pdfRead?id=" + e.currentTarget.dataset.id
      })
    } else{//暂无权限
      wx.showToast({
        title: '您尚未购买，暂无查看权限',
        icon: 'none',
        duration: 2000
      })
    }
  },
  bayBtn() {//购买按钮
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      this.dialog.show()
    }
  },
  videTap() {//查看无权限视频
    let that = this
    wx.showToast({
      title: '您尚未购买，暂无播放权限',
      icon: 'none',
      duration: 2000
    })
  },
  formatDuring(mss,type) {//时间格式化
    let hours = parseInt((mss / (1000 * 60 * 60 )));
    let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((mss % (1000 * 60)) / 1000);
    hours = hours > 0 ? hours >= 10 ? hours + ":" : "0" + hours + ":" : ''
    minutes = minutes >= 10 ? minutes+":" : "0" + minutes +":"
    seconds = seconds >= 10 ? seconds: "0" + seconds
    if (type == 'timesEnd'){
      this.setData({
        showTime2: hours + minutes + seconds
      })
    } else{
      this.setData({
        showTime1: hours + minutes + seconds
      })
    }
  }
})