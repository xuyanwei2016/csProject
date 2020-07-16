var app = getApp()
const api = require("../../api/search.js").API

Page({
  data: {
    content:'',
    hotWordList:[],
    historyList: [],
  },
  onLoad: function (options) {
    this.getHotWords() //热搜词
  },
  onReady: function () {//生命周期函数--监听页面初次渲染完成
    this.setData({
      historyList: wx.getStorageSync('word')
    })
  },
  getHotWords() {//热搜词
    api.getHotWord({num:10}).then(res =>{
      if (res.data.code == 0) {
        this.setData({
          hotWordList: res.data.data
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  changeWord(e){//失去焦点存val值
    this.setData({
      content: e.detail.value
    })
  },
  changeHistory(e) { //历史搜索跳转
    this.setHistory(e.currentTarget.dataset.content)
    wx.redirectTo({ //跳转
      url: "../resource/resource?content=" + e.currentTarget.dataset.content
    })
  },
  changeSearch(e) { //热搜词跳转
    this.setHistory(e.currentTarget.dataset.content)
    wx.redirectTo({ //跳转
      url: "../resource/resource?content=" + e.currentTarget.dataset.content
    })
  },
  searchBtn() {//搜索按钮--搜索页面
    let word = this.data.content
    wx.redirectTo({ //跳转
      url: "../resource/resource?content=" + word
    })
    if(word) {
      this.setHistory(word)
    }
  },
  setHistory(obj) { //设置搜索历史词
    let arr = wx.getStorageSync('word')
    if (arr && arr.length > 0) {
      let isRepeat = arr.indexOf(obj)
      if (isRepeat >= 0) {//已经存在历史记录了
        arr.splice(isRepeat, 1)
        arr.unshift(obj)
      } else{
        if (arr.length>=10) {//控制数量
          arr.splice(9, 1)
        }
        arr.unshift(obj)
      }
    } else {
      arr = []
      arr.unshift(obj)
    }
    wx.setStorageSync('word', arr)
  },
  clearHistory(){//清空历史记录
    wx.clearStorageSync('word');
    this.setData({
      historyList: wx.getStorageSync('word')
    })
    wx.showToast({
      title: '清除成功',
      icon: 'none',
      duration: 2000
    })
  },
  cancelPage() { //取消---返回
    wx.navigateBack()
  },
})