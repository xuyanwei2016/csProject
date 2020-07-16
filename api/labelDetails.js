const app = getApp();
const request = require("../utils/request").request

const API = {
  getLabelDetailsListPAI: (data) => request('GET', `${app.resource1}/resource/label/Type/list`),  // 资源类型列表（tab展开全部）
  getlabelDetailsNewHatListAPI: (data) => request('GET', `${app.resource1}/resource/label/info`, data)  // 默认最热最新
}
module.exports = {
  API
}