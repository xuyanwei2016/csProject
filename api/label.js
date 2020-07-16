const app = getApp();
const request = require("../utils/request").request

const API = {
  getLabelListPAI: (data) => request('GET', `${app.resource1}/label/list?pageNum=1&pageSize=99`), // 标签列表
  labelDetCourseAPI: (data) => request('GET', `${app.resource}/course-library/recommend/list`, data),  //推荐课程
  labelDetSubAPI: (data) => request('GET', `${app.resource1}/project-library/list`, data),  //推荐专题（大咖说说）
  labelDetReadAPI: (data) => request('GET', `${app.resource1}/resource/label/info/${data.oid}`, data),  //推荐专题（大咖说说）

  



  
}
module.exports = {
  API
}