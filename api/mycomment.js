const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const sysuser = 'sysuser1/fg'
const member = 'member1/fg'
const third = 'third1'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  getListAPI: (data) => request(GET, `${sysuser}/comment/personal`, data)  //获取列表
}


module.exports = {
  API
}