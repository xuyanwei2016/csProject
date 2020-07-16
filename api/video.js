const app = getApp();
const request = require("../utils/request").request

const API = {
  videoDetAPI: (data) => request('GET', `${app.resource}/video-library/detail`, data), //视频详情
  videoTimeAPI: (data) => request('POST', `${app.resource}/video-library/timeLength/save`, data), //视频播放时长
  getVideoAPI: (data) => request('GET', `${app.file}/getVideoImg`, data), //m3u8
  getVideoOtherAPI: (data) => request('GET', `${app.file1}/getVideoImg`,data), //m3u8
  getAudioAPI: (data) => request('GET', `${app.file}/getFilePath`, data), //mp4格式
  getAudioArtAPI: (data) => request('GET', `${app.file1}/getFilePath`, data), //mp4格式
}

module.exports = {
  API
}




