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
  getSpecialList: (data) => request(GET, `${resource}/project-library/list`), //专题列表
  getSpecialDetails: (data) => request(POST, `${resource}/project-library/get/${data}`), //专题详情
}


module.exports = {
  API
}