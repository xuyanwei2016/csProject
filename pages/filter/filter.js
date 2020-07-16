const api = require("../../api/resource.js").API
const utils = require("../../utils/util.js")

Page({
  data: {
    sortId:'',
    labelId:'',
    sort:[],
    label: [],
    dataList:[],
    listQuery:{
      pageSize: 10,
      pageNum:1,
      resourceType: '',
      diyTypeCode: '',
      labelContentDiyTypeId:'',
      content:'',
      name:'',
    },
    diyTypeCode:[],
    labelContentDiyTypeId:[],
    pageName:''
  },
  onLoad: function (options) {//生命周期函数--监听页面加载
    this.setData({
      ['listQuery.resourceType']: options.resourceType,
    })
    if(options.pageName){//页面类型 ---问答还是resource
      this.setData({
        pageName: options.pageName,
        ['listQuery.name']: options.name 
      })
    }
    if (options.diyTypeCode){
      let data = options.diyTypeCode.split(",")
      this.setData({
        ['listQuery.diyTypeCode']: options.diyTypeCode,
        diyTypeCode: data
      })
    }
    if (options.labelContentDiyTypeId) {
      let data = options.labelContentDiyTypeId.split(",")
      this.setData({
        ['listQuery.labelContentDiyTypeId']: options.labelContentDiyTypeId,
        labelContentDiyTypeId: data
      })
    }
    if (options.content) {
      this.setData({
          ['listQuery.content']: options.content
      })
    }
    this.getData()
  },
  getData() { //获取分类
    let data = utils.clearObj(this.data.listQuery)
    api.getList(data).then(res => {
      let that = this
      if (res.data.code == 0) {
        if (res.data.data.labelList && res.data.data.labelList.length>0){
          res.data.data.labelList.forEach(function (item, index) {
            item.labelContent.forEach(function (i, v) {
              i.id = String(i.id)
            })
          })
        }
        this.setData({
          sort: res.data.data.diyTypeList,
          label: res.data.data.labelList 
        })
        //默认选中第一项
        if (this.data.sort && this.data.sort.length>0){//默认选中第一项---分类
          let data = this.data.sort[0].children
          let code = this.data.sort[0].code
          that.setData({
            dataList: data,
            sortId: code
          })
        } else{
          if (this.data.label && this.data.label.length > 0) {//默认选中第一项
            let data = this.data.label[0].labelContent
            let id = this.data.label[0].labelId
            that.setData({
              dataList: data,
              labelId: id
            })
          }
        }
      } else{
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  labelTap(e) {//选择一级标签
    const id = e.currentTarget.dataset['index']
    this.setData({
      labelId: id,
      sortId: null,
    })
    let that = this
    that.data.label.forEach(function (item, index) {
      if (item.labelId == id) { //渲染二级标签
        that.setData({
          dataList: item.labelContent
        })
      }
    })
  },
  sortTap(e) {//选择分类
    const code = e.currentTarget.dataset['index']
    this.setData({
      sortId: code,
      labelId: null
    })
    let that = this
    that.data.sort.forEach(function(item,index){
      if (item.code == code){
        that.setData({
          dataList: item.children
        })
      }
    })
  },
  sortWord(e) {//选择分类
    let code = e.currentTarget.dataset['code']
    let newArr = this.data.diyTypeCode
    let isRepeat = newArr.indexOf(code) //去重
    if (isRepeat<0){//数组不存在code
      newArr.push(code)
    } else{//删除
      newArr.splice(isRepeat,1)
    }
    this.setData({
      diyTypeCode: newArr,
    })
  },
  labelWord(e) {//选择二级标签
    let id = e.currentTarget.dataset['id']
    let newArr = this.data.labelContentDiyTypeId
    let isRepeat = newArr.indexOf(id) //去重
    if (isRepeat < 0) {//数组不存在code
      newArr.push(id)
    } else {//删除
      newArr.splice(isRepeat, 1)
    }
    this.setData({
      labelContentDiyTypeId: newArr,
    })
  },
  resetBtn() {//重置
    this.setData({
      labelContentDiyTypeId:[],
      diyTypeCode:[],
      ['listQuery.diyTypeCode']: '',
      ['listQuery.labelContentDiyTypeId']: '',
    })
    console.log(this.data.listQuery.diyTypeCode, 3333)
    this.getData()
  },
  filterBtn() {//确定
    this.setData({
      ['listQuery.diyTypeCode']: this.data.diyTypeCode,
      ['listQuery.labelContentDiyTypeId']: this.data.labelContentDiyTypeId
    })
    let data = this.data.listQuery
    let { pageSize, pageNum, ...rest } = data
    for (let i in rest) {
      if (!rest[i] || rest[i].length == 0) {
        delete rest[i]
      }
    }
    this.setData({
      listQuery: rest
    })
    let object = utils.paramsObj(this.data.listQuery)
    if (this.data.pageName){//问答页面
      wx.redirectTo({
        url: "../anwser/anwser?" + object
      })
    } else{//资源页面
      wx.redirectTo({
        url: "../resource/resource?" + object
      })
    }
  },
})