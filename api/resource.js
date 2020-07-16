const app = getApp();
const request = require("../utils/request").request

const API = {
  getResourceList: (data) => request('GET', `${app.resource1}/resource/article-library/Type/list`), //资源列表--文章...
  getList: (data) => request('GET', `${app.resource1}/resource/xcx/search`,data), //资源列表
}

module.exports = {
  API
}