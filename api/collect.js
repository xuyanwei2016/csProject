const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const sysuser = 'sysuser1/fg'
const member = 'member1/fg'
const third = 'third1'

const API = {
  getListAPI: (data) => request('GET', `${app.resource}/member-collection/page`, data),  //获取列表
  deleteAPI: (data) => request('POST', `${member}/member-collection/delete`, data)  //取消收藏
}


module.exports = {
  API
}