const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  // 作者详情
  getExpertAuthorPAI: (data) => request(GET, `${resource}/authorLibrary/${data.id}`),
  // 推荐著作
  getExpertWorkListPAI: (data) => request(GET, `${resource}/authorLibrary/relation-resource/page?id=`+ data.id),

}
module.exports = {
  API
}