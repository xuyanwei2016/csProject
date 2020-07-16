var app = getApp()
const api = require("../../api/review.js").API
const utils = require("../../utils/util.js")

Page({
  data: {
    content:'',
    resourceId: '',
    resourceType: '',
    defaultScore: 0,
    lightScore:5,
    resourceName:'',
    defaultData:[
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
    ]
  },
  onLoad: function (options) { //生命周期函数--监听页面加载
    this.setData({
      resourceId: options.resourceId,
      resourceType: options.resourceType,
    })
    if(options.resourceName) {
      this.setData({
        resourceName: options.resourceName
      })
    }
  },
  onReady: function () {//生命周期函数--监听页面初次渲染完成

  },
  changeReview(e) {
    let that = this
    that.setData({
      content: e.detail.value
    })
  },
  submitBtn() {
    if(this.data.content){//判断是否提交了content
      let params = {
        score: this.data.lightScore, //评分
        content: this.data.content,//评论内容 
        resourceId: this.data.resourceId, // resourceId (string, optional): 资源id ,
        resourceType: this.data.resourceType,// resourceType (integer, optional): 资源类型 
        fatherId: 0, // fatherId (integer, optional): 父级评论id：0资源，其他评论id ,
        mainId: 0, // mainId (integer, optional): 所属主评论id：0资源主评论，其他主评论id , 
        resourceName: this.data.resourceName
      }
      if(params.resourceType != 2) {
        api.saveReview(params).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '评论成功',
              icon: 'none',
              duration: 1000
            })
            wx.navigateBack()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        api.replySave(params).then(res => {
          if (res.data.code == 0) {
            wx.showToast({
              title: '评论成功',
              icon: 'none',
              duration: 1000
            })
            wx.navigateBack()
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
      
    } else{
      wx.showToast({
        title: '请填写评论',
        icon: 'none',
        duration: 2000
      })
    }
  },
  changeScore(e) {//星星
    if (e.currentTarget.dataset.type == 'light'){//点击亮星星
      this.setData({
        defaultScore: 5-(e.currentTarget.dataset.index),
        lightScore: e.currentTarget.dataset.index,
      })
    } else{ //点击灰色星星
      let ligthNum = this.data.lightScore //获取点击之前的亮星星个数
      this.setData({
        lightScore: ligthNum + (e.currentTarget.dataset.index),
        defaultScore: 5 - (ligthNum + (e.currentTarget.dataset.index)),
      })
    }
  },
})