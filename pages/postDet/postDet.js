const api = require("../../api/post.js").API
var app = getApp()
const utils = require("../../utils/util.js")

Page({
    data: {
        detailsId: null,
        isIphoneX: false,
        listQuery: {
            pageNum: 1,
            pageSize: 5,
            oid: ''
        },
        imageUrl: app.imageUrl,
        pageData: {},
        reviewData: [],
        listNull: "",
        replyHide: false,
        replyQuery: {
            content: '', //评论内容
            fatherId: '',
            fatherName: '',
            mainId: '', //所属主评论id：0资源主评论，其他主评论id
            title: ''
        },
        reviewType: 'forum',
        pages: '',
        content: null,
        reviewTotal: '',
        reviewNum: '',
        reviewQuery: {
            pageNum: 1,
            pageSize: 20,
            oid: ''
        },
    },
    onShow: function() {
        let pages = getCurrentPages(); //页面栈
        let currPage = pages[pages.length - 1]; //当前页面
        this.setData({
            ['listQuery.oid']: currPage.options.id, //获取上上级页面传的参数
            ['reviewQuery.oid']: currPage.options.id
        })
        this.getDetails()
    },
    onLoad: function(options) { // 生命周期函数--监听页面加载
        this.setData({
            isIphoneX: app.isIphoneX()
        })
    },
    getDetails() { //详情
        wx.showLoading({ //加载中
            title: '加载中',
        })
        api.postDetAPI(this.data.listQuery).then(res => {
            if (res.data.code == 0) {
                this.setData({
                    pageData: res.data.data,
                    content: res.data.data.content ? res.data.data.content.replace(/\<img/gi, '<img style="width:100%;height:auto;"') : '',
                })
                this.getReviewList() //获取评论列表
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 2000
                })
            }
            wx.hideLoading(); // 隐藏加载框
        })
    },
    getReviewList() { //评论列表
        wx.showLoading({ //加载中
            title: '加载中',
        })
        api.reviewAPI(this.data.reviewQuery).then(res => {
            if (res.data.code == 0) {
                var list = []
                if (this.data.reviewQuery.pageNum == 1) { //第一页
                    list = res.data.data.list
                } else {
                    list = this.data.reviewData.concat(res.data.data.list)
                }
                this.setData({
                    reviewData: list,
                    reviewTotal: res.data.data.pages,
                    ['pageData.reviewNum']: res.data.data.total,
                    listNull: res.data.data.list && res.data.data.list.length > 0 ? false : true
                })
                console.log(this.data.reviewNum,9999111)
            } else {
                Toast(res.data.msg)
            }
            wx.hideLoading(); // 隐藏加载框
        })
    },
    onReachBottom() { //评论分页
        if (this.data.reviewTotal > this.data.reviewQuery.pageNum) { //判断是否有下一页
            let currentNum = this.data.reviewQuery.pageNum + 1
            this.setData({
                ['reviewQuery.pageNum']: currentNum
            })
            this.getReviewList()
        }
    },
    replyBtn() { //回复
        if (!wx.getStorageSync('y-token')) {
            wx.navigateTo({
                url: '../login/login',
            })
        } else {
            this.setData({
                replyHide: true
            })
        }
    },
    hideBox() { //关闭弹窗
        this.setData({
            replyHide: false
        })
    },
    replyCon(e) { //评论内容
        this.setData({
            ['replyQuery.content']: e.detail.value
        })
    },
    sendMsg() { //评论
        if (!this.data.replyQuery.content) {
            wx.showToast({
                title: '请输入评论内容',
                icon: 'none',
                duration: 1000
            })
            return false
        }
        wx.showLoading({ //加载中
            title: '加载中',
        })
        this.setData({
            ['replyQuery.fatherId']: this.data.pageData.id,
            ['replyQuery.mainId']: this.data.pageData.id,
            ['replyQuery.fatherName']: this.data.pageData.userName,
            ['replyQuery.title']: this.data.pageData.title,
        })
        api.sendPostAPI(this.data.replyQuery).then(res => {
            if (res.data.code == 0) {
                this.setData({
                    replyHide: false,
                    replyQuery: {}
                })
                wx.hideLoading(); // 隐藏加载框
                wx.showToast({
                    title: '评论成功',
                    icon: 'none',
                    duration: 2000
                })
                this.getDetails()
            } else {
                wx.hideLoading(); // 隐藏加载框
                wx.showToast({
                    title: res.data.msg,
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    },
    delPost() { //删除帖子
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定删除该帖?',
            success: function(res) {
                if (res.confirm) {
                    api.deletePostAPI(that.data.listQuery.oid).then(res => {
                        if (res.data.code == 0) {
                            wx.showToast({
                                title: '删除成功',
                                icon: 'none',
                                duration: 2000
                            })
                            setTimeout(function() {
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
                }
            }
        })
    },
    agreeTap() { //帖子详情点赞
        if (!wx.getStorageSync('y-token')) {
            wx.navigateTo({
                url: '../login/login',
            })
        } else {
            if (this.data.pageData.isAgree != 1) { //可以点赞
                api.agreeAPI(this.data.listQuery.oid).then(res => {
                    if (res.data.code == 0) { //点赞成功
                        this.setData({
                            ['pageData.fabulousNum']: this.data.pageData.fabulousNum + 1,
                            ['pageData.isAgree']: 1
                        })
                        Toast('点赞成功');
                    } else {
                        Toast(res.data.msg);
                    }
                })
            }
        }
    },
    myList(e) { //评论评论点赞 --- icon实现
        let that = this
        api.agreeAPI(e.detail.id).then(res => {
            if (res.data.code == 0) { //点赞成功
                let data = that.data.reviewData
                data.forEach(function(item, index) {
                    if (item.id == e.detail.id) {
                        item.isAgree = 1
                        item.fabulousNum = item.fabulousNum + 1
                    }
                })
                that.setData({
                    reviewData: data
                })
                wx.showToast({
                    title: '点赞成功',
                    icon: 'none',
                    duration: 1000
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
    onShareAppMessage: function(options) { //用户点击右上角分享
        return {
            title: '财税专家',
            success: function(shareTickets) {
                console.info(shareTickets + '成功');
                // 转发成功
            },
            fail: function(res) {
                console.log(res + '失败');
                // 转发失败
            },
            complete: function(res) {
                // 不管成功失败都会执行
            }
        }
    }
})