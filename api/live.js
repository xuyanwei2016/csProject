const app = getApp();
const request = require("../utils/request").request

const API = {
  getDetPayAPI: (data) => request('GET', `${app.live}/live/get/info?id=${data}`), //中间页面（支付）
  getDetAPI: (data) => request('GET', `${app.live}/backplay/get/info?id=${data}`), //获取回放

}

module.exports = {
  API
}