// pages/pdfRead/pdfRead.js
const app = getApp()
const api = require("../../api/article.js").API

Page({
  data: {
    pdfPath: '',
    requestUrl: app.requestUrl,
    bool: 'false',
  },
  onLoad: function (options) {
    let that = this
    setTimeout(function() {
      that.setData({
        pdfPath: options.id,
        bool: true
      })
    },1000)
  },
})