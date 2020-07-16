const app = getApp();
const request = require("../utils/request").request

const API = {
  freeCourseAPI: (data) => request('GET', `${app.resource}/recommend/page`, data), //免费课程
  seriesCourseAPI: (data) => request('GET', `${app.resource}/course-library/series/page`, data), //系列课
  listenCourseAPI: (data) => request('GET', `${app.resource}/course-library/listen/page`, data), //听解读
  classDetAPI: (data) => request('GET', `${app.resource}/course-library/detail`,data), //课程详情
  reviewAPI: (data) => request('GET', `${app.sysuser}/comment/page`, data), //课程评论列表
  agreeAPI: (data) => request('POST', `${app.sysuser}/comment/agree?commentId=${data}`), //点赞
  favAPI: (data) => request('POST', `${app.resource}/member-collection/batch/save`, data), //收藏
  cancelFavAPI: (data) => request('POST', `${app.resource}/member-collection/batch/delete`, data), //取消收藏
  myCourseAPI: (data) => request('GET', `${app.order}/order/page/buy`, data), //我的课程列表
  getLiveAPI: (data) => request('GET', `${app.live}/live/page`, data), //

  // live/page

  

  
}

module.exports = {
  API
}