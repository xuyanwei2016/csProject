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
  getClassDetails: (data) => request(GET, `${resource}/smallclass/get/`+data), //微课详情
  getReview: (data) => request(GET, `${sysuser}/comment/page`, data), //评论列表
  getBookDetails: (data) => request(GET, `${resource}/ebook/get/${data}`), //图书详情
}


module.exports = {
  API
}


