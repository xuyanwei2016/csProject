var app = getApp()
const api = require("../../api/review.js").API
const commonApi = require("../../api/common.js").API

Component({
    properties: {
        complate: {
            type: Boolean,
            value: false
        },
        id: {
            type: String,
            value: ''
        },
        cover: {
            type: String,
            value: ''
        },
        name: {
            type: String,
            value: ''
        }
    },
    data: {
        codeUrl: app.codeUrl,
        codeImg: '',
        shareDialog: false,
        backgroundImg: '',
        imagePathFir: '',
        coverImg: '',
        nameFir: '',
        nameSec: '',
        commonUrl: app.commonUrl
    },
    ready() {
        console.log(12321132)
    },
    observers: {
        'complate' (commission) {
            if (commission) {
                this.openDialog()
            }
        }
    },
    methods: {
        openDialog() { //打开分享弹窗
            let that = this
            let newId = this.data.id
            if (newId.length > 16) {
                newId = newId.substring(16, 32)
            }
            let data = {
                // 'page': 'pages/index/index',
                'scene': decodeURIComponent('id=' + newId)
            }
            commonApi.getCodeAPI(data).then(res => { //请求二维码--access-token
                if (res.data.code == 0) { //accessToken---res.data.data
                    let url = this.data.codeUrl + res.data.data
                    wx.getImageInfo({
                        src: url,
                        success(imageRes) {
                            console.log(imageRes, 78888)
                            that.setData({ //二维码画布
                                codeImg: imageRes.path,
                                shareDialog: true
                            })
                            console.log(that.data.codeImg, 1111)
                                //画布背景图片
                            wx.downloadFile({
                                url: that.data.commonUrl + '/skz/program/background_3.png',
                                success: function(sres) {
                                    that.setData({
                                        backgroundImg: sres.tempFilePath
                                    })
                                }
                            })
                            console.log(that.data.cover, 6666)
                            wx.downloadFile({ //资源封面
                                    url: that.data.cover,
                                    success: function(sres) {
                                        that.setData({
                                            coverImg: sres.tempFilePath
                                        })
                                        console.log(that.data.coverImg, 7888888)
                                    }
                                })
                                //分享名称
                            if (that.data.name.length > 15) {
                                that.setData({
                                    nameFir: that.data.name.substring(0, 15)
                                })
                                if (that.data.name.length > 15 && that.data.name < 26) {
                                    that.setData({
                                        nameSec: that.data.name.substring(15, 26)
                                    })
                                } else if (that.data.name.length > 26) {
                                    that.setData({
                                        nameSec: that.data.name.substring(15, 26) + '...'
                                    })
                                }
                            } else {
                                that.setData({
                                    nameFir: that.data.name
                                })
                            }
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
            ctx.drawImage(that.data.backgroundImg, 0, 0, 270, 450) //背景
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
            console.log(313321231)
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
        closeShare() { //关闭分享弹窗
            wx.hideLoading(); // 隐藏加载框
            this.setData({
                shareDialog: false
            })
        }
    }
})