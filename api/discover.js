const app = getApp();
const request = require("../utils/request").request

const API = {
  getNumAPI: (data) => request('GET', `${app.resource1}/resource/Type/count`, data), //获取数量
  getListAPI: (data) => request('GET', `${app.sysuser1}/forum/page`, data), //获取列表
   
}

module.exports = {
  API
}