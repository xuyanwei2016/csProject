var app = getApp()
const api = require("../../api/post.js").API

Page({
  data: {
    listQuery:{
      title: '',
      fatherId: 0,
      mainId: 0,
      content: '',
      imgList: [],
    },
    imageUrl: app.imageUrl,
  },
  onLoad: function (options) {

  },
  bindTitleInput(e) {//标题
    this.setData({
      ['listQuery.title']: e.detail.value
    })
  },
  bindConInput(e) {//内容
    this.setData({
      ['listQuery.content']: e.detail.value
    })
  },
  setImage() {//上传图片
   let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          url: app.imageUrl +'upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
            wx.hideLoading();// 隐藏加载框
            that.setData({
              ['listQuery.imgList']: that.data.listQuery.imgList.concat(res.data)
            })
          }
        })
      }
    })
  },
  delImage(e) {//删除图片
    let index = e.currentTarget.dataset.index
    let data = this.data.listQuery.imgList
    data.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      ['listQuery.imgList']: data
    })
  },
  sendInfo() {//提交
    wx.showLoading({
      title: '提交中…',
    })
    if (!(this.data.listQuery.title.length > 0 && this.data.listQuery.title.length <= 20)) {//判断标题--（必填，20字以内）
      wx.hideLoading()
      wx.showToast({
        title: '请输入1-20个字符的标题',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!(this.data.listQuery.content.length >= 5 && this.data.listQuery.content.length <= 2000)) {//判断内容-（必填，5-2000）
      wx.hideLoading()
      wx.showToast({
        title: '请输入5-2000个字符的内容',
        icon: 'none',
        duration: 1000
      })
      return
    }
    api.sendPostAPI(this.data.listQuery).then(res =>{
      if (res.data.code == 0) {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.switchTab({
            url: "../discover/discover"
          })
        }, 1000);
       
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
})