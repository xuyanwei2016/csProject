var app = getApp()
var ifLogin;
const orderApi = require("../api/order.js").API
const loginApi = require("../api/login.js").API
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}


const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//清空空对象
function clearObj(objData) {
  for (let i in objData) {
    if (!objData[i]) {
      delete objData[i]
    }
  }
  return objData
}

//处理参数---页面传值使用
function paramsObj(obj) {
  let stringObj = ""
  for (let i in obj) {
    stringObj += i + "=" + obj[i] + "&"
  }
  stringObj = stringObj.slice(0, stringObj.length - 1)
  return stringObj
}

// 立即支付，判断是否是微信授权登录
function payment(obj) {
  let isModel = app.isModel()
  if(isModel == true) {
    wx.showToast({
      title: '由于相关规定，ios功能暂不可用',
      icon: 'none',
      duration: 1000
    })
  } else {
    wx.login({
      success: res => {
        let that = this;
        let code = { code: res.code }
        loginApi.wechatxcxLogin(code).then(res => {
          if (res.data.code == 0) {
            let openid = res.data.data.openid
            let session_key = res.data.data.session_key
            let wechatKey = res.data.data.openid
            wx.setStorageSync('openid', res.data.data.openid)
            wx.setStorageSync('session_key', res.data.data.session_key)
            orderApi.createOrderAPI(obj).then(ret => {
              if (ret.data.code == 0) {
                let objData = JSON.parse(ret.data.data)
                wx.requestPayment({
                  timeStamp: objData.timeStamp,
                  nonceStr: objData.nonceStr,
                  package: 'prepay_id=' + objData.package,
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
          }
        })
      }
    })
  }
}

module.exports = {
  formatTime,
  clearObj,
  paramsObj,
  payment,
}
