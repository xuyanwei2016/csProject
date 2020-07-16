import touch from 'utils/touch.js'
var requestUrl = 'https://zgsccbs.com'
// var requestUrl = 'https://192.168.2.226'
App({
    onLaunch: function() {

    },
    //是否是ipX
    isIphoneX() {
        let info = wx.getSystemInfoSync();
        if (/iPhone X/i.test(info.model)) {
            return true;
        } else {
            return false;
        }
    },
    // 是否是ios，还是android
    isModel() {
        let winInfo = wx.getSystemInfoSync();
        if (/ios/i.test(winInfo.platform)) {
            return true;
        } else {
            return false;
        }
    },
    globalData: {
        userInfo: null
    },

    commonUrl: requestUrl,
    requestUrl: requestUrl + "/",
    otherImageUrl: requestUrl + "/file/file/",
    imageUrl: requestUrl + "/file1/file/",
    fileUrl: requestUrl + "/file1/",
    liveImg: requestUrl + "/file/",
    codeUrl: requestUrl,
    file: 'file/file',
    file1: 'file1/file',
    resource: 'resource/fg',
    resource1: 'resource1/fg',
    sysuser1: 'sysuser1/fg',
    sysuser: 'sysuser/fg',
    order: 'order/fg',
    member1: 'member1/fg',
    live: 'live/fg',
    livePath: 'https://live.vhall.com/webinar/inituser/',
    touch: new touch()
})