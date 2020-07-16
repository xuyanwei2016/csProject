const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const sysuser = 'sysuser1/fg'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  getebookDetails: (data) => request(GET, `${resource}/ebook/get/` + data), //阅读页
  getArticleAPI: (data) => request(GET, `${resource}/article-library/get` , data)
}

module.exports = {
  API
}