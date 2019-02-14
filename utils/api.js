const baseUrl = 'https://www.sundaysee.cn/nxdcs-service/';

const http = ({ url = '', param = {}, ...other } = {}) => {
  wx.showLoading({
    title: '正在加载..'
  });
  let timeStart = Date.now();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json' // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
      },
      ...other,
      complete: (res) => {
        wx.hideLoading();
        console.log(res);
        console.log(`耗时${Date.now() - timeStart}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const getRequest = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const postRequest = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

const putRequest = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const deleteRequest = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}
module.exports = {
  baseUrl,
  getRequest,
  postRequest,
  putRequest,
  deleteRequest
}
