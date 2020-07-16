const app = getApp();
const request = require("../utils/request").request

const API = {
  getCourseList: (data) => request('GET', `${app.resource}/course-library/hot/page`, data), //热门课程
  getlabelId: (data) => request('GET', `${app.resource1}/label/info`, data), //根据标签获取详情
  getAdsList: (data) => request('GET', `${app.sysuser1}/adspace/signvalue`,data), //轮播图列表
  getRecommendList: (data) => request('GET', `${app.resource1}/recommend/content/page`, data), //推荐位
  getRecommendAPI: (data) => request('GET', `${app.resource1}/recommend/content/page/xcx`, data), //推荐位
  // getMember: (data) => request('GET', `${app.member1}/pm/count`)//查询是否有未读消息


}

module.exports = {
  API
}