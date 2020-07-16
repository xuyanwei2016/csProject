var app = getApp()
const api = require("../../api/review.js").API

Component({
  behaviors: [],
  properties: {//组件的属性列表
    reviewData:{
      type: Array,
      value:''
    },
    listNull: {
      type: Boolean,//类型
      value: ''//默认值
    },
    reviewTotal: {
      type: String,//类型
      value: 'default value'//默认值
    },
    name: {
      type: String,
      value:''
    },
    reviewType: {
      type: String,//类型
      value: 'default value'//默认值
    },
    postId: {
      type: String,//类型
      value: 'default value'//默认值
    },
  },
  data: {
    urlPath: app.imageUrl,
    defaultData: [
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5 },
    ]
  },
  methods: {//组件的方法列表
    favListBtn(e){//点赞
      if (e.currentTarget.dataset.agree == 0){
        if(!wx.getStorageSync('y-token')) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          this.triggerEvent('myList', { id: e.currentTarget.dataset.id })
        }
      }
    },
    reviewDetails(e) {//查看全部评论
      wx.navigateTo({ //跳转
        url: "../comments/comments?resourceType=" + this.data.reviewData[0].resourceType + "&resourceId=" + this.data.reviewData[0].resourceId + "&name=" + this.data.name
      })
    },
    reply(e) {//评论详情
      wx.navigateTo({ ///帖子的回复页面
        url: "../../components/reply/reply?id=" + e.currentTarget.dataset.replyid + "&type=" + this.data.reviewType + '&postId=' + this.data.postId
      })
    },

  }
})
