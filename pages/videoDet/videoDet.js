const api = require("../../api/video.js").API
const apis = require("../../api/course.js").API
const orderApi = require("../../api/order.js").API
const loginApi = require("../../api/login.js").API
const commonApi = require("../../api/common.js").API
const myApi = require("../../api/my.js").API
var app = getApp()

Page({
    data: {
        pageData: {},
        intro: null,
        isOpen: false,
        urlPath: app.otherImageUrl,
        requestUrl: app.requestUrl,
        reviewTotal: null,
        reviewData: [],
        isIphoneX: false,
        tabType: 'detail',
        listQuery: {
            oid: '',
        },
        reviewType: 'video',
        play: false,
        videoTimes: '',
        content: null,
        liveImg: app.liveImg,
        poster: '',
        isModel: false,
        orderText: '倒序',
        ifLogin: false,
        listNull: false,
        codeUrl: app.codeUrl,
        codeImg: '',
        shareDialog: false,
        coverImg: '',
        nameFir: '',
        nameSec: '',
        background_fir: '',
        imagePathFir: '',
        videoSrc: '',
        commonUrl: app.commonUrl,
        openid:null,
        session_key:null,
        createTime:null,
        account:'',
    },
    onShow: function() { // 生命周期函数--监听页面显示
        myApi.getMemberAPI().then(res => {
            if (res.data.code == 0) {
                this.setData({
                    account: res.data.data.account
                })
            }
        })
        if (this.data.listQuery.oid) {
            this.getReviewList() //获取评论列表
        }
    },
    onUnload() { //离开页面
        if(this.data.videoTimes && this.data.videoTimes>0) {
            this.stopVideo()
        }
    },
    onReady: function(e) {
        this.videoContext = wx.createVideoContext('myVideo') //创建播放器
    },
    onLoad: function(options) { // 生命周期函数--监听页面加载
        this.setData({
            ['listQuery.oid']: options.id,
            isIphoneX: app.isIphoneX()
        })
        this.getDetails()
    },
    timeupdate(e) { //实时监听视频播放事件
        let currentTime = e.detail.currentTime
        this.setData({
            videoTimes: currentTime
        })
    },
    previewImg(e) {
        console.log(111)
        console.log(e)
    },
    stopVideo() { //暂停
        let times = (this.data.videoTimes * 1000).toFixed(0)
        let data = {
            time: times,
            videoId: this.data.listQuery.oid
        }
        api.videoTimeAPI(data).then(res => {})
    },
    changeTab(e) { //切换目录和详情和推荐
        this.setData({
            tabType: e.currentTarget.dataset.type
        })
    },
    getDetails() { //获取课程详情
        let that = this
        wx.showLoading({ //加载中
            title: '加载中',
        })
        api.videoDetAPI(this.data.listQuery).then(res => {
            if (res.data.code == 0) {
                this.setData({
                        pageData: res.data.data,
                        content: res.data.data.detail ? res.data.data.detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto"') : '',
                        createTime: res.data.data.createTime ? res.data.data.createTime.substring(0,11) : ''
                    })
                    //获m3u8格式的视频
                api.getVideoAPI({ fileName: this.data.pageData.video }).then(res => {
                    if (res.data.code == 0) {
                        this.setData({
                            videoSrc: res.data.data,
                        })
                    }
                })
                if (that.data.pageData.cover) {
                    that.setData({
                        poster: that.data.urlPath + '?fileName=' + that.data.pageData.cover
                    })
                } else {
                    that.setData({
                        poster: that.data.liveImg + that.data.pageData.defaultCover
                    })
                }
                //分享名称
                if (this.data.pageData.name.length > 15) {
                    this.setData({
                        nameFir: this.data.pageData.name.substring(0, 15)
                    })
                    if (this.data.pageData.name.length > 15 && this.data.pageData.name.length < 26) {
                        this.setData({
                            nameSec: this.data.pageData.name.substring(15, 26)
                        })
                    } else if (this.data.pageData.name.length > 26) {
                        this.setData({
                            nameSec: this.data.pageData.name.substring(15, 26) + '...'
                        })
                    }
                } else {
                    this.setData({
                        nameFir: this.data.pageData.name
                    })
                }
                //分享封面
                if (that.data.pageData.cover) {
                    let cover = that.data.urlPath + '?fileName=' + that.data.pageData.cover
                    wx.downloadFile({
                        url: cover,
                        success: function(sres) {
                            that.setData({
                                coverImg: sres.tempFilePath
                            })
                        }
                    })
                } else {
                    that.setData({
                        coverImg: "../../images/course/cover.png"
                    })
                }
                //画布背景图片
                wx.downloadFile({
                    url: that.data.commonUrl + '/skz/program/background_3.png',
                    success: function(sres) {
                        that.setData({
                            background_fir: sres.tempFilePath
                        })
                    }
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
    sharePic() { //打开分享弹窗
        let token = wx.getStorageSync('y-token') //判断是否登录
        if (!token) {
            wx.navigateTo({
                url: '../../pages/login/login',
            })
            return false
        }
        let that = this
        let newId = that.data.listQuery.oid
        if (newId.length > 16) {
            newId = newId.substring(16, 32)
        }
        let data = {
            // 'page': 'pages/index/index',
            'scene': decodeURIComponent('id=' + newId)
        }
        commonApi.getCodeAPI(data).then(res => { //请求二维码--access-token
            if (res.data.code == 0) { //accessToken---res.data.data
                let url = that.data.codeUrl + res.data.data
                wx.getImageInfo({
                    src: url,
                    success(imageRes) {
                        that.setData({
                            codeImg: imageRes.path,
                            shareDialog: true
                        })
                        that.picFir() //第一个画布
                    },
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
    picFir() { //fir_样式
        let that = this
        var ctx = wx.createCanvasContext('myCanvas')
        ctx.drawImage(that.data.background_fir, 0, 0, 270, 450) //背景
        ctx.drawImage('../../images/common/cover.png', 15, 30, 25, 25) // 头像
        ctx.setFontSize(14) //文字大小
        ctx.fillStyle = "#333333";
        ctx.fillText(that.data.account, 48, 37) //文字后跟的参数为文字启示坐标
        ctx.setFontSize(12) //文字大小
        ctx.fillStyle = "#999999";
        ctx.fillText('给您分享一堂好课', 48, 57)
        ctx.drawImage(that.data.coverImg, 15, 70, 240, 163) // 封面
        ctx.setFontSize(15) ////标题
        ctx.fillStyle = "#121212";
        ctx.fillText(that.data.nameFir, 20, 265) //文字后跟的参数为文字启示坐标
        ctx.setFontSize(15) ////标题
        ctx.fillStyle = "#121212";
        ctx.fillText(that.data.nameSec, 20, 290) //文字后跟的参数为文字启示坐标
            // 长按识别图中小程序码
        ctx.setFontSize(12) //文字大小
        ctx.fillStyle = "#999DA8";
        ctx.fillText('长按识别图中小程序码', 20, 370) //文字后跟的参数为文字启示坐标
        ctx.setFontSize(12) //文字大小
        ctx.fillStyle = "#BDC1CB";
        ctx.fillText('了解更多课程', 20, 395) //文字后跟的参数为文字启示坐标
        ctx.drawImage(that.data.codeImg, 180, 340, 72, 67) //背景
            //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        wx.showLoading({
            title: '分享图片生成中...',
        })
        ctx.draw(false, function() {
            that.setPic("myCanvas")
        })
    },
    setPic(drawName) { //pic
        let that = this
        setTimeout(function() {
            wx.canvasToTempFilePath({
                canvasId: drawName,
                fileType: 'jpg',
                quality: 1,
                success: function(res) {
                    if (drawName == 'myCanvas') {
                        that.setData({
                            imagePathFir: res.tempFilePath
                        })
                    } else if (drawName == 'myCanvasSec') {
                        that.setData({
                            imagePathSec: res.tempFilePath
                        })
                    } else if (drawName == 'myCanvasThird') {
                        that.setData({
                            imagePathThird: res.tempFilePath
                        })
                    }
                    wx.hideLoading(); // 隐藏加载框
                },
                fail: function(res) {
                    wx.hideLoading(); // 隐藏加载框
                }
            })
        }, 3000)
    },
    savePost(e) { //new
        let that = this
        let photo = ''
        if (e.target.dataset.type == 'myCanvas') {
            photo = this.data.imagePathFir
        }
        wx.saveImageToPhotosAlbum({
            filePath: photo,
            success(res) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 1000
                })
            },
            fail(res) {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    closeShare() { //关闭
        wx.hideLoading(); // 隐藏加载框
        this.setData({
            shareDialog: false
        })
    },
    payBtn() { //立即支付
        if (!wx.getStorageSync('y-token')) {
            wx.navigateTo({
                url: '../login/login',
            })
        } else {
            if (!wx.getStorageSync('openid')) {
                wx.login({
                  success: res => {
                    let that = this;
                    let code = { code: res.code }
                    loginApi.wechatxcxLogin(code).then(res => {
                      if (res.data.code == 0) {
                        this.setData({
                          'openid': res.data.data.openid,
                          'session_key': res.data.data.session_key
                        })
                        wx.setStorageSync('openid', res.data.data.openid)
                        this.createOrder()
                      }
                    })
                  }
                })
            } else {
                this.createOrder()
            }
        }
    },
    // 订单是否支付
    isPay() {
        let that = this
        orderApi.isPayAPI({oid: wx.getStorageSync('orderId')}).then(res => {
        if(res.data.data == 1) {
            wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 1000
            })
            this.getDetails()
        } else {
            setTimeout(function() {
                that.getDetails()
            },2000)
        }
        })
    },
    // 生成订单
    createOrder() {
        let that = this
        let query = {
            goodsList: [{
                goodsType: 5, //视频
                goodsid: this.data.listQuery.oid,
                num: 1,
                salesPrice: this.data.pageData.price
            }],
            openId: wx.getStorageSync('openid'),
            payType: 1, //支付类型 0支付宝1微信2易宝支付 ,
            paymentPlatform: 2, //支付平台 1H52微信小程序
            wechatPayType: 4 // 0公众号支付1扫码支付2app支付 3(H5支付)4小程序
        }
        orderApi.createOrderAPI(query).then(res => {
            if (res.data.code == 0) {
                let objData = JSON.parse(res.data.data)
                wx.setStorageSync('orderId', objData.orderId)
                wx.requestPayment({
                    'timeStamp': objData.timeStamp,
                    'nonceStr': objData.nonceStr,
                    'package': 'prepay_id=' + objData.package,
                    'signType': objData.signType,
                    'paySign': objData.paySign,
                    success(res) {
                        if(res.errMsg == 'requestPayment:ok') {
                            that.isPay() //判断是否支付
                        } else {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'loading',
                                duration: 1000
                            })
                        }
                    },
                    fail(res) {
                        wx.showToast({
                            title: '支付失败' + res.data.msg,
                            icon: 'loading',
                            duration: 2000
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: ret.data.msg,
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    },
    resourceDet(e) { //资源详情
        if (e.currentTarget.dataset.types == '3') { //课程详情
            wx.navigateTo({
                url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.types == '5') { //视频详情
            wx.navigateTo({
                url: "../videoDet/videoDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.types == '6') { //音频详情
            wx.navigateTo({
                url: "../audioDet/audioDet?id=" + e.currentTarget.dataset.id
            })
        }
    },
    changeOrder() { //更改排序
        if (this.data.orderText == '正序') {
            this.setData({
                orderText: '倒序',
                ['listQuery.orderBy']: 'sort asc'
            })
        } else {
            this.setData({
                orderText: '正序',
                ['listQuery.orderBy']: 'sort desc'
            })
        }
        this.getDetails()
    },
    getReviewList() { //获取评论列表
        let data = {
            pageSize: 5,
            pageNum: 1,
            resourceId: this.data.listQuery.oid,
            resourceType: 5 //3课程5视频6音频
        }
        apis.reviewAPI(data).then(res => {
            if (res.data.code == 0) {
                this.setData({
                    reviewData: res.data.data.list,
                    reviewTotal: res.data.data.total,
                    listNull: res.data.data.list && res.data.data.list.length > 0 ? false : true,
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
    collect() { //收藏和取消收藏
        //判断是否登录
        let token = wx.getStorageSync('y-token')
        if (!token) {
            wx.navigateTo({
                url: '../../pages/login/login',
            })
            return false
        }
        let that = this
        let data = {
            id: this.data.listQuery.oid,
            type: 5
        }
        let arr = []
        arr.push(data)
        if (this.data.pageData.isCollection == 0) { //收藏 
            apis.favAPI({ goodsList: arr }).then(res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'none',
                        duration: 2000
                    })
                    this.setData({
                        ['pageData.isCollection']: 1
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'loading',
                        duration: 2000
                    })
                }
            })
        } else { // 取消收藏
            apis.cancelFavAPI({ goodsList: arr }).then(res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '已取消收藏',
                        icon: 'none',
                        duration: 2000
                    })
                    this.setData({
                        ['pageData.isCollection']: 0
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'loading',
                        duration: 2000
                    })
                }
            })
        }
    },
    myList(e) { //点赞 --- icon实现
        let that = this
        apis.agreeAPI(e.detail.id).then(res => {
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
    addReview() { //去评论
        let token = wx.getStorageSync('y-token') //判断是否登录
        if (!token) {
            wx.navigateTo({
                url: '../../pages/login/login',
            })
            return false
        }
        wx.navigateTo({
            url: "../addReview/addReview?resourceType=" + this.data.pageData.types + "&resourceId=" + this.data.listQuery.oid + "&resourceName=" + this.data.pageData.name
        })
    },
    videTap() { //查看无权限视频
        let that = this
        wx.showToast({
            title: that.data.pageData.message,
            icon: 'none',
            duration: 2000
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