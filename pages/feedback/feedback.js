var app = getApp()
const api = require("../../api/my.js").API

Page({
  data: {
    listQuery: {
      content: '',
      imgList: [],
      source: 3
    },
    imageUrl: app.imageUrl,
  },
  getText(e){//反馈内容
    this.setData({
      ['listQuery.content']:e.detail.value
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
        wx.uploadFile({
          url: app.imageUrl + 'upload',
          filePath: tempFilePaths[0],
          name: 'file',
          success(res) {
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
  submit(){
    wx.showLoading({
      title: '提交中…',
    })
    if (this.data.listQuery.content && this.data.listQuery.content.length>=5){
      api.feedbackAPI(this.data.listQuery).then(res => {
        if (res.data.code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 1000
          })
          setTimeout(function () {
            wx.switchTab({
              url: "../my/index"
            })
          }, 1000);
        } else {
          wx.showToast({
            title: '提交失败，' + res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写5-300个字符的反馈内容哦',
        icon: 'none',
        duration: 1000
      })
    }
  }
})