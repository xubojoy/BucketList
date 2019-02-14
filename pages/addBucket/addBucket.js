import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'
const app = getApp()
var netUtil = require("../../utils/netUtil.js"); //require引入
const api = require('../../utils/api.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bucketList: {},
    done: [],
    limit: 0,
    skip: 0,
    bottomStatus: false,
    hiddenmodalput: true,
    addThings:[],
    account: {}     
  },

  addBucketTheme: function () {
    console.log("进来了");
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },  

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    var cusThings = this.data.things;
    // 单个请求
    var params = {

    }
    api.postRequest('addBucket').then(res => {
      console.log(res.data)
      this.setData({
        hiddenmodalput: true,
        things: cusThings.concat(this.data.addThings)
      })
    }).catch(e => {
      console.log(e)
    })
    
  }, 

  // 拿到手机号
  addThingsInput: function (e) {
    var addThings = e.detail.value;
    this.setData({
      addThings: addThings
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    this.setData({
      things: this.data.things
    })
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
    // 单个请求
    // 获取用户信息
    var user = wx.getStorageSync('user') || {};
    api.postRequest('queryAllBucket',{"openId":user.openid}).then(res => {
      console.log(res.data)
      this.setData({
        bucketList: res.data //请求结果数据
      })
    }).catch(e => {
      console.log(e)
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      wx.func('addperson', {
        person: e.detail.userInfo
      }).then(ret => {
        console.log(ret)
      }).catch(err => {
        console.log(err)
      })
    }
    if (e.detail.userInfo) {
      wx.navigateTo({
        url: '../self/index'
      });
    }
  },
  async onShow() {

    wx.showShareMenu()
    try {
      let ret = await wx.func('seething', {})
      console.log(ret)
      this.setData({
        done: ret.result.data
      })
      let res = await wx.func('sweethings', {
        limit: 40,
        skip: 0
      })
      console.log(res)
      let things = res.result.data
      this.data.done.forEach(item => {
        things.forEach(thing => {
          if (item.id == thing.id) {
            Object.assign(thing, item)
            thing.done = true
          }
        })
      })
      this.setData({
        things,
        limit: 20,
        skip: 40
      })
    } catch (err) {
      console.log(err)
    }
  },
  async onReachBottom() {
    try {
      let limit = this.data.limit
      let skip = this.data.skip
      if (skip >= 100) {
        this.setData({
          bottomStatus: true
        })
        return
      }
      let res = await wx.func('sweethings', {
        limit,
        skip
      })
      console.log(res)
      let things = res.result.data
      this.data.done.forEach(item => {
        things.forEach(thing => {
          if (item.id == thing.id) {
            Object.assign(thing, item)
            thing.done = true
          }
        })
      })
      skip += limit
      this.setData({
        things: this.data.things.concat(things),
        skip
      })
    } catch (err) {
      console.log(err)
    }
  },
  // goThing(e) {
  //   let index = e.currentTarget.dataset.index
  //   let things = this.data.things
  //   let id = things[index].id
  //   let sweethingid = things[index]._id
  //   if (things[index].done) {
  //     // wx.navigateTo({ url: `../share/index?sweethingid=${sweethingid}` });
  //   } else {
  //     // wx.navigateTo({ url: `../doing/index?id=${id}` });
  //   }
  // },
  goThing: function (e) {
    let index = e.currentTarget.dataset.index
    let things = this.data.things
    let themeTitle = things[index]
    // console.log("=========获取数据======" + themeTitle)
    var pages = getCurrentPages();
    var bucketThemeTitleArray = []
    // console.log("=========获取数据======" + pages.length)
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      bucketThemeTitleArray: bucketThemeTitleArray.concat(themeTitle),
    })        //给上级页面的变量赋值
    wx.navigateBack()  //返回上级页面
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})