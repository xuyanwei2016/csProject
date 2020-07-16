const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  // 标签列表
  getExpertListPAI: (data) => request(GET, `${resource}/authorLibrary/page?pageNum=${data.pageNum}&pageSize=${data.pageSize}`),

}
module.exports = {
  API
}