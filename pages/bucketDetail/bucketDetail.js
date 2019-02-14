// pages/bucketDetail/bucketDetail.js
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
import {
  Toast
} from '../../wxu/wxu'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../images/user-unlogin.png',
    bgImageUrl:'cloud://dev-1234.6465-dev-1234/img/green.png',
    openid: '',
    bucketListId: 0,
    themeId: 0,
    bucketName:'',
    nickName: '',
    bucketListName:'',
    bucketListAddress: '',
    endTIme:'',
    excerptWordEN: '',
    excerptWordCH: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   avatarUrl: userInfo.avatarUrl,
    // })

    let {
      bucketListId
    } = options

    let {
      themeId
    } = options
    let {
      openid
    } = options

    this.setData({
      bucketListId: parseInt(bucketListId),
      themeId: parseInt(themeId),
      openid: openid

    })
    this.getUserData()
    this.loadData()
    
  },


getUserData: function(){
  // 获取用户信息
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            this.setData({
              avatarUrl: res.userInfo.avatarUrl,
            })
          }
        })
      }
    }
  })
},



  loadData: function(){
    if (this.data.openid) {
      this.requestExcerptWordData()
      this.requestBucketDetailDdata()
      this.requestBucketListDetailDdata()
    } else {
      Toast({
        msg: '您还未登录！',
        success: () => console.log('showToast完成')
      })
    }
  },

  requestExcerptWordData: function(){
    api.postRequest('queryExcerptWord').then(res => {
      console.log("查询结果queryExcerptWord=======" + res.data)
      this.setData({
        excerptWordEN: res.data.excerptWordEN,
        excerptWordCH: res.data.excerptWordCH
      })
    }).catch(e => {
      console.log(e)
    });
  },

  requestBucketDetailDdata: function () {
    var params = {
      "openId": this.data.openid,
      "themeId": this.data.themeId
    }
    api.postRequest('queryBucketByThemeId', params).then(res => {
      console.log("查询结果queryBucketByThemeId=======" + res.data)
      this.setData({
        bucketName: res.data.themeName,
        nickName: res.data.nickName
      })
    }).catch(e => {
      console.log(e)
    });
  },

  requestBucketListDetailDdata: function () {
    var params = {
      "openId": this.data.openid,
      "bucketListId": this.data.bucketListId
    }
    api.postRequest('queryBucketListDetail', params).then(res => {
      console.log("查询结果bucketListDetailData=======" + res.data)
      this.setData({
        endTIme: util.formatTimeTwo(res.data.endTime,'Y-M-D'),
        bucketListName: res.data.bucketName,
        bucketListAddress: res.data.address
      })
      console.log("endtime=======" + util.formatTimeTwo(res.data.endTime, 'Y-M-D'))
    }).catch(e => {
      console.log(e)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})