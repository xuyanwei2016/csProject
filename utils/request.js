const app = getApp();
const POST = 'POST';

function request(method, url, data) {
  let yToken = '';
  if (wx.getStorageSync('y-token')){
    yToken = wx.getStorageSync('y-token')
  }
  return new Promise(function (resolve, reject) {
    let header = {
      'contentType' : 'application/json',
      'y-token': yToken
    }
    wx.request({
      url: app.requestUrl + url,
      method: method,
      data: method === POST ? JSON.stringify(data) : data,
      header: header,
      success: function (res) {
        resolve(res);
      },
      fail: function (res) {
        reject(err)
      }
    })
  })
}
module.exports = {
  request
}