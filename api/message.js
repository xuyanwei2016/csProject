const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const member = 'member1/fg'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  // 系统消息列表
  getMessageListPAI: (data) => request(GET, `${member}/pm/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}`),
  // 系统详情
  getMessageDetPAI: (data) => request(GET, `${member}/pm/get/${data.id}`),
}
module.exports = {
  API
}