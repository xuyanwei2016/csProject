const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const sysuser = 'sysuser1/fg'

const API = {
  getArticleDetails: (data) => request('GET', `${resource}/article-library/get/`+data), //文章阅读页
  getArticleCount: (data) => request('GET', `${sysuser}/comment/count`,data), //获取评论数量
  getArticleDet: (data) => request('GET', `${app.resource1}/article-library/get/${data}`), //文章详情
  getRelation: (data) => request('GET', `${app.resource1}/article-library/relation-resource/get`, data) //文章推荐
}


module.exports = {
  API
}