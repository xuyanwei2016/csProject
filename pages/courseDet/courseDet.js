const api = require("../../api/course.js").API
const orderApi = require("../../api/order.js").API
const loginApi = require("../../api/login.js").API
const myApi = require("../../api/my.js").API
const commonApi = require("../../api/common.js").API
const utils = require("../../utils/util.js")
var app = getApp()

Page({
    data: {
        pageData: {},
        intro: null,
        isOpen: false,
        urlPath: app.otherImageUrl,
        codeUrl: app.codeUrl,
        reviewTotal: null,
        reviewData: [],
        isIphoneX: false,
        tabType: 'list',
        orderText: '倒序',
        listQuery: {
            oid: '',
        },
        reviewType: 'course',
        ifLogin: false,
        phoneCode: {
            phone: ''
        },
        loginData: {
            account: null,
            code: null,
            channel: null
        },
        openid: '',
        session_key: '',
        wxPhnoe: {
            channel: null,
            phone: null,
            wechatKey: null
        },
        userPhone: '',
        content: null,
        shareDialog: false,
        imagePath: '',
        coverImg: '',
        nameFir: '',
        nameSec: '',
        background_fir: '',
        background_sec: '',
        background_third: '',
        imagePathFir: '',
        imagePathSec: '',
        imagePathThird: '',
        scence: {},
        codeImg: '',
        names: '',
        account: '',
        listNull: false,
        phone: null,
        commonUrl: app.commonUrl,
        isModel:false
    },
    onLoad: function(options) { // 生命周期函数--监听页面加载
        this.setData({
            scence: decodeURIComponent(options),
            ['listQuery.oid']: options.id,
            isIphoneX: app.isIphoneX()
        })
        this.getDetails()
        myApi.getMemberAPI().then(res => {
            if (res.data.code == 0) {
                this.setData({
                    phone: res.data.data.phone,
                    account: res.data.data.account
                })
            }
        })
        if (!wx.getStorageSync('y-token')) {
            this.setData({
                ifLogin: false
            })
        } else {
            this.setData({
                ifLogin: true
            })
        }
    },
    onShow: function() { // 生命周期函数--监听页面显示
        if (this.data.listQuery.oid && this.data.pageData.types) {
            this.getReviewList()
        }
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
        api.classDetAPI(this.data.listQuery).then(res => {
            if (res.data.code == 0) {
                this.setData({
                    pageData: res.data.data,
                    content: res.data.data.detail ? res.data.data.detail.replace(/\<img/gi, '<img style="max-width:100%;height:auto"') : ''
                })
                let names = res.data.data.courseName && res.data.data.courseName.length > 10 ? res.data.data.courseName.substring(0, 10) + '...' : res.data.data.courseName
                wx.setNavigationBarTitle({ title: names }) // 顶部标签名称
                this.setData({
                    names: names
                })
                //分享名称
                if (this.data.pageData.courseName.length > 15) {
                    this.setData({
                        nameFir: this.data.pageData.courseName.substring(0, 15)
                    })
                    if (this.data.pageData.courseName.length > 15 && this.data.pageData.courseName.length < 26) {
                        this.setData({
                            nameSec: this.data.pageData.courseName.substring(15, 26)
                        })
                    } else if (this.data.pageData.courseName.length > 26) {
                        this.setData({
                            nameSec: this.data.pageData.courseName.substring(15, 26) + '...'
                        })
                    }
                } else {
                    this.setData({
                        nameFir: this.data.pageData.courseName
                    })
                }
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
                            // this.picSec()
                            // this.picThird()
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
    // picSec() {// sec_样式
    //   let that = this
    //   var ctxSec = wx.createCanvasContext('myCanvasSec')
    //   ctxSec.drawImage(that.data.background_sec, 0, 0, 270, 450) //背景
    //   ctxSec.drawImage(that.data.coverImg, 15, 15, 240, 163)// 封面
    //   ctxSec.setFontSize(15) ////标题
    //   ctxSec.fillStyle = "#121212";
    //   ctxSec.fillText(that.data.nameFir, 20, 203) //文字后跟的参数为文字启示坐标
    //   ctxSec.setFontSize(15) ////标题
    //   ctxSec.fillStyle = "#121212";
    //   ctxSec.fillText(that.data.nameSec, 20, 230) //文字后跟的参数为文字启示坐标
    //   ctxSec.drawImage('../../images/common/cover.png', 15, 255, 25, 25)// 头像
    //   ctxSec.setFontSize(14) //文字大小
    //   ctxSec.fillStyle = "#333333";
    //   ctxSec.fillText('小公子', 48, 275) //文字后跟的参数为文字启示坐标
    //   ctxSec.setFontSize(12) //文字大小
    //   ctxSec.fillStyle = "#999999";
    //   ctxSec.fillText('给您分享一堂好课', 98, 275)
    //   ctxSec.setFontSize(12) //文字大小
    //   ctxSec.fillStyle = "#999DA8";
    //   ctxSec.fillText('长按识别图中小程序码', 80, 340) //文字后跟的参数为文字启示坐标
    //   ctxSec.setFontSize(12) //文字大小
    //   ctxSec.fillStyle = "#BDC1CB";
    //   ctxSec.fillText('了解更多课程', 80, 365) //文字后跟的参数为文字启示坐标
    //   //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    //   wx.showLoading({
    //     title: '分享图片生成中...',
    //   })
    //   ctxSec.draw(false,function(){
    //     that.setPic("myCanvasSec") 
    //   })
    // },
    // picThird() {//third_样式
    //   let that = this
    //   var ctxThird = wx.createCanvasContext('myCanvasThird')
    //   ctxThird.drawImage(that.data.background_third, 0, 0, 270, 450) //背景
    //   ctxThird.drawImage('../../images/common/cover.png', 120, 30, 25, 25)// 头像
    //   ctxThird.setFontSize(14) //文字大小
    //   ctxThird.fillStyle = "#333333";
    //   ctxThird.fillText('小公子', 115, 70) //文字后跟的参数为文字启示坐标
    //   ctxThird.setFontSize(12) //文字大小
    //   ctxThird.fillStyle = "#999999";
    //   ctxThird.fillText('给您分享一堂好课', 95, 93)
    //   ctxThird.drawImage(that.data.coverImg, 25, 110, 220, 163)// 封面
    //   ctxThird.setFontSize(15) ////标题
    //   ctxThird.fillStyle = "#121212";
    //   ctxThird.fillText(that.data.nameFir, 30, 300) //文字后跟的参数为文字启示坐标
    //   ctxThird.setFontSize(15) ////标题
    //   ctxThird.fillStyle = "#121212";
    //   ctxThird.fillText(that.data.nameSec, 30, 325) //文字后跟的参数为文字启示坐标
    //   ctxThird.setFontSize(12) //文字大小
    //   ctxThird.fillStyle = "#999DA8";
    //   ctxThird.fillText('长按识别图中小程序码', 124, 370) //文字后跟的参数为文字启示坐标
    //   ctxThird.setFontSize(12) //文字大小
    //   ctxThird.fillStyle = "#BDC1CB";
    //   ctxThird.fillText('了解更多课程', 124, 390) //文字后跟的参数为文字启示坐标
    //   //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    //   wx.showLoading({
    //     title: '分享图片生成中...',
    //   })
    //   ctxThird.draw(false, function () {
    //     that.setPic("myCanvasThird")
    //   })
    // },
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
        } else if (e.target.dataset.type == 'myCanvasSec') {
            photo = this.data.imagePathSec
        } else if (e.target.dataset.type == 'myCanvasThird') {
            photo = this.data.imagePathThird
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
    resourceDet(e) { //目录--资源详情
        if (e.currentTarget.dataset.type == '3') { //课程详情
            wx.navigateTo({
                url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.type == '5') { //视频详情
            wx.navigateTo({
                url: "../videoDet/videoDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.type == '6') { //音频详情
            wx.navigateTo({
                url: "../audioDet/audioDet?id=" + e.currentTarget.dataset.id
            })
        }
    },
    resourceDetails(e) { //推荐-资源详情
        if (e.currentTarget.dataset.type == '3') { //课程详情
            wx.navigateTo({
                url: "../courseDet/courseDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.type == '5') { //视频详情
            wx.navigateTo({
                url: "../videoDet/videoDet?id=" + e.currentTarget.dataset.id
            })
        } else if (e.currentTarget.dataset.type == '6') { //音频详情
            wx.navigateTo({
                url: "../audioDet/audioDet?id=" + e.currentTarget.dataset.id
            })
        }
    },
    recommendBtn() { //开始学习按钮(有权限按钮)
        let prevId = this.data.pageData.newVideoId
        if (prevId != null) {
            this.data.pageData.list.forEach(function(item, index) {
                if (prevId == item.id) {
                    if (item.types == '5') { //视频详情
                        wx.navigateTo({
                            url: "../videoDet/videoDet?id=" + prevId
                        })
                    } else if (item.types == '6') { //音频详情
                        wx.navigateTo({
                            url: "../audioDet/audioDet?id=" + prevId
                        })
                    }
                }
            })
        } else if (this.data.pageData.list.length > 0) {
            let study = this.data.pageData.list[0]
            if (study.types == '5') { //视频详情
                wx.navigateTo({
                    url: "../videoDet/videoDet?id=" + study.id
                })
            } else if (study.types == '6') { //音频详情
                wx.navigateTo({
                    url: "../audioDet/audioDet?id=" + study.id
                })
            }
        } else {
            wx.showToast({
                title: '暂无学习资源',
                icon: 'none',
                duration: 1000
            })
        }
    },
    tryBtn() { //试听按钮
        if (this.data.pageData.list.length > 0) {
            var listArr = this.data.pageData.list.filter(el => {
                return el.messageCode == null
            })
            if (listArr.length > 0) {
                if (listArr[0].types == '5') {
                    wx.navigateTo({
                        url: '../videoDet/videoDet?id=' + listArr[0].id,
                    })
                } else if (listArr[0].types == '6') {
                    wx.navigateTo({
                        url: '../audioDet/audioDet?id=' + listArr[0].id,
                    })
                }
            } else {
                wx.showToast({
                    title: '暂无可试听的学习资源',
                    icon: 'none',
                    duration: 1000
                })
            }
        } else {
            wx.showToast({
                title: '暂无学习资源',
                icon: 'none',
                duration: 1000
            })
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
                goodsType: 3, //课程
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
                    'package':  'prepay_id=' + objData.package,
                    'signType': objData.signType,
                    'paySign': objData.paySign,
                    'success': function(res) {
                        if(res.errMsg == 'requestPayment:ok') {
                            that.isPay() //判断是否已支付
                        } else {
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none',
                                duration: 1000
                              })
                        }
                    },
                    'fail': function(res) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'loading',
                            duration: 2000
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
    payBtn() { //立即支付按钮
        if (!wx.getStorageSync('y-token')) {
            wx.navigateTo({
                url: '../login/login',
            })
        } else {
            this.setData({
                isModel: app.isModel()
            })
            if(this.data.isModel == true) {
                wx.showToast({
                  title: '由于相关规定，ios功能暂不可用',
                  icon: 'none',
                  duration: 1000
                })
            } else {
                this.createOrder()
            }
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
            name: this.data.name,
            resourceId: this.data.listQuery.oid,
            resourceType: 3 //3课程5视频6音频
        }
        api.reviewAPI(data).then(res => {
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
        let token = wx.getStorageSync('y-token') //判断是否登录
        if (!token) {
            wx.navigateTo({
                url: '../../pages/login/login',
            })
            return false
        }
        let that = this
        let data = {
            id: this.data.listQuery.oid,
            type: 3
        }
        let arr = []
        arr.push(data)
        if (this.data.pageData.isCollection == 0) { //收藏 
            api.favAPI({ goodsList: arr }).then(res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '收藏成功',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(function() {
                        that.getDetails()
                    }, 1000);
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'loading',
                        duration: 2000
                    })
                }
            })
        } else { // 取消收藏
            api.cancelFavAPI({ goodsList: arr }).then(res => {
                if (res.data.code == 0) {
                    wx.showToast({
                        title: '已取消收藏',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(function() {
                        that.getDetails()
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
    },
    
    
    //微信登录
    wxLogin() {
        let query = {
            goodsList: [{
                goodsType: 3, //课程
                goodsid: this.data.listQuery.oid,
                num: 1,
                salesPrice: this.data.pageData.price
            }],
            openId: wx.getStorageSync('openid'),
            payType: 1, //支付类型 0支付宝1微信2易宝支付 ,
            paymentPlatform: 2, //支付平台 1H52微信小程序
            wechatPayType: 4 // 0公众号支付1扫码支付2app支付 3(H5支付)4小程序
        }
        if (this.data.phone) {
            orderApi.createOrderAPI(query).then(ret => {
                if (ret.data.code == 0) {
                    let objData = JSON.parse(ret.data.data)
                    wx.requestPayment({
                        timeStamp: objData.timeStamp,
                        nonceStr: objData.nonceStr,
                        package:  objData.package,
                        signType: objData.signType,
                        paySign: objData.paySign,
                        success(ret) {
                            console.log(ret, 66666)
                        },
                        fail(ret) {
                            wx.showToast({
                                title: '支付失败' + ret.data.msg,
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
        } else {
            utils.payment(query)
        }
    },
    getPhoneNumber: function(e) {
        var ivObj = e.detail.iv
        var telObj = e.detail.encryptedData
        var codeObj = "";
        var that = this;
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            let obj = {
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                session_key: wx.getStorageSync('session_key')
            }
            loginApi.wechatlogin(obj).then(res => {
                if (res.data.code == 0) {
                    let obj = {
                        phone: res.data.data,
                    }
                    loginApi.upPhone(obj).then(res => {
                        if (res.data.code == 0) {
                            wx.setStorageSync('y-token', res.data.data.token);
                            wx.reLaunch({
                                url: "../index/index"
                            })

                        }
                    })
                }
            })
        } else {
            wx.showToast({
                title: '登陆失败',
                icon: 'none',
                duration: 1000
            })
        }
    },
    myList(e) { //点赞 --- icon实现
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
    addReview() { //去评论
        let token = wx.getStorageSync('y-token') //判断是否登录
        if (!token) {
            wx.navigateTo({
                url: '../../pages/login/login',
            })
            return false
        }
        wx.navigateTo({
            url: "../addReview/addReview?resourceType=" + this.data.pageData.types + "&resourceId=" + this.data.listQuery.oid + "&resourceName=" + this.data.pageData.courseName
        })
    },
    shareBtn() {

    },
    onShareAppMessage: function(options) {
        return {
            title: this.data.pageData.courseName,
            path: '/pages/courseDet/courseDet?id=' + this.data.listQuery.oid,
            imageUrl: '/images/common/index.png'
        }
    }
})