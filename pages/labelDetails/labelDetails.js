var app = getApp()
const api = require("../../api/labelDetails.js").API
const utils = require("../../utils/util.js")
Page({
  data: {
    hiddenCome:true,
    tabTitleList:[],
    listQuery:{
      pageNum: 1,
      pageSize: 20,
      resourceType:'0',
      orderBy:"uploadTime desc",
      name:'',
      oid:'',
      isNull: '',
      isLast: ''
    },
    comeColour:0,
    listQueryId:'',
    tabLeft:[
      { tab:'默认'},
      { tab: '最热' },
      { tab: '最新' },
    ],
    tabColour:0,
    resourceList:[],
    urlPath: app.imageUrl,
    comeNum:0,
    loading:false,
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: options.title })// 顶部标签名称
    this.data.listQuery.name = options.name
    this.data.listQuery.oid = options.oid
    this.data.listQuery.resourceType = options.resourceType
    this.getList()
  },
  // 资源类型列表（tab展开全部）
  getLabelDetailsList(e){ 
    wx.showLoading({ //加载中
      title: '加载中',
    })
    let that = this
    api.getLabelDetailsListPAI().then(res => {
      if (res.data.status) {
        that.setData({ tabTitleList:res.data.data})
      } else {
        wx.showToast({
          titler:res.data.msg,
          icon:'loading',
          duration:2000
        })
      }
    })
    wx.hideLoading();// 隐藏加载框
  },
  // 点击默认最新最热
  tabClick(e) {
    this.setData({
      tabColour: e.currentTarget.dataset.index,
      hiddenCome: true,
    })
    this.data.resourceList = []
    let newHot = this.data.tabColour
    if (newHot == 0) {     //默认
      this.data.listQuery.orderBy = ''
      this.data.listQuery.resourceType = this.data.listQuery.resourceType
      this.getList()
    } else if (newHot == 1) { //最热
      this.data.listQuery.orderBy = 'browseNum desc'
      this.data.listQuery.resourceType = this.data.listQuery.resourceType
      this.getList()
    } else if (newHot == 2) { //最新
      this.data.listQuery.orderBy = 'uploadTime desc'
      this.data.listQuery.resourceType = this.data.listQuery.resourceType
      this.getList()
    }
  },
  // 资源类型列表tab切换
  labelDetailsTab(e){
    this.setData({
      resourceType: e.currentTarget.dataset.index,
      comeColour: e.currentTarget.dataset.index,
      hiddenCome: !this.data.hiddenCome
    })
    this.data.resourceList = []
    this.data.listQuery.resourceType = this.data.resourceType
    this.getList()
  },
  // 遮罩层隐藏
  maskClick(){
    this.setData({
      hiddenCome:!this.data.hiddenCome
    })
  },
  // tab全部展开闭合
  clickCome: function () {
    this.setData({
      hiddenCome: !this.data.hiddenCome
    })
  },
  // 分页
  onReachBottom: function () {
    if (this.data.totalPage > this.data.listQuery.pageNum) {//判断是否有下一页
      let currentNum = this.data.listQuery.pageNum + 1
      let pageNum = 'listQuery.pageNum'
      this.setData({
        [pageNum]: currentNum
      })
      this.getList()
    }
  },
  onPullDownRefresh: function () {
    let pageNum = 'listQuery.pageNum'
    this.setData({
      [pageNum]: 1,
      resourceList: []
    })
    this.getList()
  },
  getList(){//获取列表
    wx.showLoading({
      title:'玩命加载中'
    })
    this.setData({
      loading: true
    })
    wx.stopPullDownRefresh()
    let data = utils.clearObj(this.data.listQuery)
    api.getlabelDetailsNewHatListAPI(data).then(res=>{
      if (res.data.code == 0){
        var list = []
        if (this.data.resourceList && this.data.resourceList.length > 0) {
          list = this.data.resourceList.concat(res.data.data.resList)
        } else {
          list = res.data.data.resList
        }
        this.setData({
          resourceList: list,
          totalPage: res.data.data.pageCount,
          isNull: list && list.length > 0 ? false : true,
          isLast: res.data.data.pageCount == this.data.listQuery.pageNum ? true : false
        })
      }else{
        wx:showToast({
          title:res.data.msg,
          icon:'loading',
          duration:2000
        })
      }
      wx.hideLoading();// 隐藏加载框
      this.setData({
        loading: false
      })
    })
  },
})