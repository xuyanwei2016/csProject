const app = getApp();
const request = require("../utils/request").request
const resource = 'resource1/fg'
const sysuser = 'sysuser1/fg'
const member1 = 'member1/fg'
const third = 'third1'
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const FORM = 'FORM';
const DELETE = 'DELETE';

const API = {
  getCode: (data) => request(GET, `${member1}/permissions/code-phone`, data),
  toRegister: (data) => request(POST, `${member1 }/permissions/register/p-member/phone`, data),//手机号注册
  getLoginCode: (data) => request(GET, `${member1}/permissions/permissions/code`, data),
  toLogin: (data) => request(POST, `${member1}/permissions/register/p-member/phone`, data),//手机号快速登录
  getzcAreement: (data) => request(GET, `${sysuser}/dictionary/dictionary`, data),
  boutUs: (data) => request(GET, `${sysuser}/dictionary/app-version`, data),
  aboutUsDesc: (data) => request(GET, `${sysuser}/dictionary/get`, data),
  wechatxcxLogin: (data) => request(GET, `${third}/wechat-xcx-login/query`, data),//传code给后台
  logout: (data) => request(GET, `${member1}/permissions/logout`, data),//传code给后台
  wechatlogin: (data) => request(POST, `${third}/wechat-xcx-login/get/phone`, data),//小程序获取手机号
  xcxbind: (data) => request(POST, `${member1}/permissions/xcx/bind`, data),//小程序绑定手机号登录
  getUnionid: (data) => request(POST, `${third}/wechat-xcx-login/get/unionid`,data),//小程序获取用户信息
  upPhone: (data) => request(POST, `${member1}/personal-center/xcx/update/phone`,data),//我的绑定手机号
}


module.exports = {
  API
}