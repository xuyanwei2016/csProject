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
  getHotWord: (data) => request(GET, `${sysuser}/hotsw/list`,data), //热搜词



}


module.exports = {
  API
}