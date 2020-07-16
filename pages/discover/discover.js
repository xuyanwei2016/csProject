//获取应用实例 
const app = getApp()
const api = require("../../api/discover.js").API

Page({
  data: {
    navList: [
      { text: '问答', url: 'nav_anwser', query: '问答', num:'' ,type:'35'},
      { text: '案例', url: 'nav_case', query: '案例', num: '', type: '32' },
    ],
    listQuery:{
      pageNum:1,
      pageSize: 20,
      type: 1, //1热门，2提问
    },
    exampleList: [], 
    imageUrl: app.imageUrl,
    tabType: 'hot',
    hasNextPage: false,
    isNull:'',
  },
  onShow() { 
    this.getNum()
    this.getList()
  },
  resourcePage(e) {//问答和案例跳转
    let type = e.currentTarget.dataset.type
    let query = e.currentTarget.dataset.query
    wx.navigateTo({
      url: "../anwser/anwser?resourceType=" + type + "&name=" + query
    })
  },
  tabClick(e) {//切换tab
    let type = e.currentTarget.dataset.type
    this.setData({
      tabType: type
    })
    if(type == 'hot'){//热门
      let newType = 'listQuery.type'
      this.setData({
        [newType] : 1
      })
    } else{ //提问
      let newType = 'listQuery.type'
      this.setData({
        [newType]: 2
      })
    }
    let pageNum = 'listQuery.pageNum'
    this.setData({
      [pageNum]: 1
    })
    this.getList()
  },
  getNum() {//获取资源数量
    api.getNumAPI().then(res =>{
      if (res.data.code == 0) {
        res.data.data.map(el =>{
          if (el.resourceName == '问答'){
            let number = 'navList[0].num'
            this.setData({
              [number] : el.num
            })
          } else if (el.resourceName == '案例') {
            let number = 'navList[1].num'
            this.setData({
              [number]: el.num
            })
          }
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
  getList() {//列表
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    api.getListAPI(this.data.listQuery).then(res =>{
      if (res.data.code == 0) {
        var list = []
        if (this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data.list
        } else {
          list = this.data.exampleList.concat(res.data.data.list)
        }
        this.setData({
          exampleList: list,
          hasNextPage: res.data.data.hasNextPage,
          isNull: list && list.length>0?false:true,
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
  onReachBottom: function () {//列表分页
    if (this.data.hasNextPage) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      let pageNum = 'listQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getList()
    }
  },
  resourceItem: function () {// 点击跳转至资源列表页
    wx.navigateTo({
      url: "../search/search"
    })
  },
  sendPost() {//发帖页面
    if(!wx.getStorageSync('y-token')) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
      wx.navigateTo({
        url: "../sendPost/sendPost"
      })
    }
  },
  goDetails(e) {//发帖详情
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: "../postDet/postDet?id="+id
    })
  },
})