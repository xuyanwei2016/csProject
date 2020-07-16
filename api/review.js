const app = getApp();
const request = require("../utils/request").request

const API = {
  saveReview: (data) => request('POST', `${app.sysuser}/comment/save`,data), //添加评论
  getReview: (data) => request('GET', `${app.sysuser1}/comment/page`, data), //获取评论列表
  agreeReview: (data) => request('POST', `${app.sysuser1}/comment/agree?commentId=`+data), //点赞
  reviewDetails: (data) => request('GET', `${app.sysuser1}/comment/get/${data}`), //帖子评论详情
  replySave: (data) => request('POST', `${app.sysuser1}/comment/save`, data), //帖子添加回复
  forumReviewDet: (data) => request('GET', `${app.sysuser1}/forum/get`,data), // 发帖评论回复
  reviewCourseDetails: (data) => request('GET', `${app.sysuser}/comment/get/${data}`), //课程评论详情
  

  
  
}


module.exports = {
  API
}