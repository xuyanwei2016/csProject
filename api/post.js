const app = getApp();
const request = require("../utils/request").request

const API = {
    sendPostAPI: (data) => request('POST', `${app.sysuser1}/forum/save`, data), //发帖
    postDetAPI: (data) => request('GET', `${app.sysuser1}/forum/get`, data), //帖子详情
    agreeAPI: (data) => request('POST', `${app.sysuser1}/forum/agree`, data), //点赞
    deletePostAPI: (data) => request('POST', `${app.sysuser1}/forum/delete/${data}`), //删除
    reviewAPI: (data) => request('GET', `${app.sysuser1}/forum/get/reply/list`, data) //帖子的评论列表
}

module.exports = {
    API
}