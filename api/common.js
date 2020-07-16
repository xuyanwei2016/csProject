const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const member = 'member1/fg'
const sysuser = 'sysuser1/fg'
const order = 'order1/fg'

const API = {
  favAPI: (data) => request('POST', `${member}/member-collection/batch/save`,data), //收藏
  cancelFavAPI: (data) => request('POST', `${member}/member-collection/delete`,data), //取消收藏
  getDeal: (data) => request('GET', `${sysuser}/dictionary/dictionary`, data),
  getVipAPI: (data) => request('GET', `${member}/vip/page`), //获取vip服务
  getOrderAPI: (data) => request('POST', `${order}/order/create-vip-order/new`, data), //获取订单
  getCodeAPI: (data) => request('GET', `third1/wechat-xcx-login/qr`,data), //获取菊花式二维码
  isPaymentAPI: (data) => request('GET', `${order}/order/check-is-paid`,data), //判断订单是否支付成功
}

module.exports = {
  API
}