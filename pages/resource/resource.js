      
var app = getApp()
const api = require("../../api/resource.js").API
const utils = require("../../utils/util.js")

Page({
  data: {
    resourceList: {},
    pageList:[],
    urlPath: app.imageUrl,
    otherPath: app.otherPath,
    listQuery:{
      pageNum: 1,
      pageSize: 10,
      resourceType: '0',
      diyTypeCode:'',
      labelContentDiyTypeId: '',
      content:'',
      orderBy: '',
    },
    totalPage:null,
    inputValue: '',
    searchType : 1,
    totalCount: "",
    isNull: '',
    isLast: ''
  },
  onLoad: function (options) {//监听页面加载
    if (options.diyTypeCode){ //分类
      this.setData({
          ['listQuery.diyTypeCode']: options.diyTypeCode
      })
    }
    if (options.labelContentDiyTypeId) { //标签
      this.setData({
        ['listQuery.labelContentDiyTypeId']: options.labelContentDiyTypeId
      })
    }
    if (options.resourceType) {//资源类型
      this.setData({
        ['listQuery.resourceType']: options.resourceType
      })
    }
    if (options.content) {//搜索词
      this.setData({
        ['listQuery.content']: options.content,
        inputValue: options.content
      })
    }
    this.getResourceList()
    this.getList()
  },
  onReachBottom: function () {//页面上拉触底事件的处理函数
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      this.setData({
        ['listQuery.pageNum']: currentNum
      })
      this.getList()
    }
  },
  onPullDownRefresh() {//下拉刷新
    let pageNum = 'listQuery.pageNum'
    this.setData({
      [pageNum]: 1,
      pageList: []
    }) 
    this.getList()
  },
  getList(){//资源列表
    wx.showLoading({title: '玩命加载中'})
    wx.stopPullDownRefresh()
    let data = utils.clearObj(this.data.listQuery)
    api.getList(data).then(res =>{
      if (res.data.code == 0) {
        var list = []
        if(this.data.listQuery.pageNum == 1){ //第一页
          list = res.data.data.resList
        } else{
          list = this.data.pageList.concat(res.data.data.resList)
        }
        this.setData({
          pageList: list,
          totalPage: res.data.data.pageCount,
          totalCount: res.data.data.totalCount,
          isNull: list && list.length > 0 ? false : true,
          isLast: res.data.data.pageCount == this.data.listQuery.pageNum ? true : false
        })
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.hideLoading();// 隐藏加载框
    })
  },
  getResourceList:function() {
    let that = this
    api.getResourceList().then(res => { //获取资源列表--nav
      if (res.data.code == 0) {
        that.setData({
          resourceList: res.data.data,
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
  bindFilter:function() {//打开筛选按钮
    if(this.data.listQuery.resourceType != 0) {
      let data = this.data.listQuery
      let { pageSize, pageNum, ...rest } = data
      for (let i in rest) {
        if (!rest[i]) {
          delete rest[i]
        }
      }
      this.setData({
        listQuery: rest
      })
      let object = utils.paramsObj(this.data.listQuery)
      wx.redirectTo({ //跳转
        url: "../filter/filter?" + object
      })
    }
  },
  resourceTap(e) {//切换资源类型
    this.setData({
      pageList:[],
      searchType:1,
      isNull: '',
      isLast: '',
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        content: this.data.listQuery.content,
        resourceType: e.currentTarget.dataset.index,
      }
    })
    this.getList()
  },
  searchPage() {
    wx.redirectTo({ //跳转
      url: "../search/search"
    })
  },
  backBtn() { //头部返回
    wx.navigateBack()
  },
  setDataList(e) { //最新最热
    let orderBy = 'listQuery.orderBy'
    let pageNum = 'listQuery.pageNum'
    let pageSize = 'listQuery.pageSize'
    this.setData({
      [orderBy]: e.currentTarget.dataset.name,
      searchType: e.currentTarget.dataset.index,
      [pageNum]: 1,
      pageList: [],
    })
    this.getList()
  },
})
