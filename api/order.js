const app = getApp();
const request = require("../utils/request").request

const API = {
  createOrderAPI: (data) => request('POST', `${app.order}/order/create-digital-order-and-pay`, data), //创建订单
  getOrderAPI: (data) => request('GET', `${app.order}/order/my/page`, data), //我的订单列表
  orderDetAPI: (data) => request('GET', `${app.order}/order/detail`, data), //我的订单列表
  isPayAPI: (data) => request('GET', `${app.order}/order/check-is-paid`, data), //订单是否支付
}


module.exports = {
  API
}