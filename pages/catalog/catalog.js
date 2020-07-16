
var app = getApp()
const api = require("../../api/reader.js").API
Page({
  data: {
    cover:'',
    urlPath: app.imageUrl,
    name:'',
    author:'',
    messageCode:null,
    chapterList:[]
  },
  onLoad(option) {
    this.setData({
      id: option.id
    })
    this.getData()
  },
  getData() {
    api.getebookDetails(this.data.id).then(res => {
      if (res.data.code == 0) {
        this.setData({
          cover:res.data.data.img,
          name:res.data.data.name,
          author:res.data.data.author,
          chapterList: res.data.data.chapterList,
          messageCode: res.data.data.messageCode
        })
      }else{
        wx.showToast({
          title:'获取图书信息失败',
          icon:'none',
          duration:1000
        })
      }
    })
  },
  //获取图书
  toReader(e){
    console.log(e.currentTarget.dataset.index)
    if (e.currentTarget.dataset.index>2&&this.data.messageCode){
      return
    }else{
      wx.navigateTo({
        url: "../reader/reader?id=" + this.data.id + "&markid=" + e.currentTarget.dataset.markid
      })
    }
    
    
  }

})