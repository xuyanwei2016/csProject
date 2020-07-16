const app = getApp();
const request = require("../utils/request").request
const member1 = 'member1/fg'

const API = {
  feedbackAPI: (data) => request('POST', `${app.sysuser1}/message/save`, data),//意见反馈
  getMemberAPI: (data) => request('GET', `${member1}/personal-center/get/member`, data),
  loginOutAPI: (data) => request('GET', `${member1}/permissions/logout`, data)
}

module.exports = {
  API
}