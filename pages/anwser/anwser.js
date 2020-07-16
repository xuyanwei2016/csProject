var app = getApp()
const api = require("../../api/resource.js").API
const utils = require("../../utils/util.js")

Page({
  data: {
    resourceList:[],
    listQuery:{
      pageSize: 10,
      pageNum: 1,
      resourceType: '',
      content: '',
      name:'',
    },
    searchType: 1,
    inputValue: '',
    hasNextPage: false,
    isNull: '',
  },
  onLoad: function (options) {//生命周期函数--监听页面加载
    wx.setNavigationBarTitle({ title: options.name })
    this.setData({//页面标题
      ['listQuery.name']: options.name,
    })
    if (options.resourceType){ //资源类型
      this.setData({
        ['listQuery.resourceType']: options.resourceType,
      })
    }
    if (options.diyTypeCode) { //分类
      this.setData({
        ['listQuery.diyTypeCode']: options.diyTypeCode
      })
    }
    if (options.labelContentDiyTypeId) { //标签
      this.setData({
        ['listQuery.labelContentDiyTypeId']: options.labelContentDiyTypeId
      })
    }
    if (options.content) {//搜索词
      this.setData({
        ['listQuery.content']: options.content,
        inputValue: options.content
      })
    }
    this.getList()
  },
  onReachBottom() {//分页
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      this.setData({
        ['listQuery.pageNum']: currentNum
      })
      this.getList()
    } else {
      wx.showLoading({
        title: '已加载全部数据',
        duration: 1000
      })
    }
  },
  onPullDownRefresh() {//下拉刷新
    this.setData({
      ['listQuery.pageNum']: 1,
      resourceList: [],
    })
    this.getList()
  },
  getList(){//列表数据
    let that = this
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.stopPullDownRefresh()
    api.getList(this.data.listQuery).then(res => {
      if (res.data.code == 0) {
        var list = []
        if (this.data.listQuery.pageNum == 1) { //第一页
          list = res.data.data.resList
        } else {
          list = that.data.resourceList.concat(res.data.data.resList)
        }
        that.setData({
          resourceList: list,
          totalPage: res.data.data.pageCount,
          isNull: list && list.length > 0 ? false : true,
          isLast: res.data.data.pageCount == this.data.listQuery.pageNum ? true: false
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
      wx.hideLoading();// 隐藏加载框
      this.setData({
        loading: false
      })
    })
  },
  changeVal(e) {//input值change
    this.setData({
      ['listQuery.content']: e.detail.value
    })
  },
  searchBtn() {//搜索按钮--搜索页面
    this.getList()
  },
  setDataList(e) { //搜索
    this.setData({
      ['listQuery.orderBy']: e.currentTarget.dataset.name,
      searchType: e.currentTarget.dataset.index,
      ['listQuery.pageNum']: 1,
      resourceList: [],
    })
    this.getList()
  },
  bindFilter: function () {//打开筛选按钮
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
      url: "../filter/filter?pageName=anwser&" + object
    })
  },
})