//index.js
import { Toast } from '../../wxu/wxu'
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmapwx/qqmap-wx-jssdk.js');
var qqmapsdk;
//获取应用实例
const app = getApp()
// var user = wx.getStorageSync('user') || {};
// var userInfo = wx.getStorageSync('userInfo') || {};
// var openid = wx.getStorageSync('openid')
Page({
  data: {
    motto: 'Hello World',
    avatarUrl: '../../images/user-unlogin.png',
    userInfo: {},
    nickName:'',
    bgGifUrl: 'cloud://dev-1234.6465-dev-1234/img/wish.GIF',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //控制progress
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器
    // progress_txt: '0%',// 提示文字
    hiddenmodalput: true,
    bucketList: [],
    addTheme: '',
    //轮播页当前index
    swiperCurrent: 0,
    isShow: false,
    openid:''
  },

  

  onLoad: function() {
    // this.getOpenIdData()
  },

  getOpenIdData: function(){
    var that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
    }).then(res => {
      // output: res.result === 3
      console.log('[云函数] [login] user openid: ', res.result.openid)
      that.refreshIndexData(res.result.openid)

    }).catch(err => {
      // handle error
    });
   
  },

  refreshIndexData: function (openid){
    // 单个请求
    // 获取用户信息
    api.postRequest('queryAllBucket', {
      "openId": openid
    }).then(res => {
      console.log("查询结果=======" + res.data)
      this.setData({
        bucketList: res.data //请求结果数据
      })
    }).catch(e => {
      console.log(e)
    })
  },

  // 创建清单
  createNewAccount: function (e) {
    // console.log('获取用户信息数据111111==============' + e.detail.userInfo)
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
    // wx.navigateTo({
    //   url: '../addBucket/addBucket'
    // })
  },

  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认  
  confirm: function () {
    
  },

  confirm: util.throttle(function (e) {
    var that = this
    var cusAddTheme = this.data.addTheme;
    // var user = wx.getStorageSync('user') || {};
    // 单个请求
    if (cusAddTheme) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
      }).then(res => {
        // output: res.result === 3
        console.log('[云函数] [login] user openid: ', res.result.openid)
        var openidStr = res.result.openid
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  that.setData({
                    avatarUrl: res.userInfo.avatarUrl,
                    userInfo: res.userInfo,
                    nickName: res.userInfo.nickName
                  });
                  that.requestAddThemeData(openidStr, cusAddTheme, res.userInfo.nickName)
                }
              })
            }
          }
        })

      }).catch(err => {
        // handle error
      });

    } else {
      console.log('主题我空')
      Toast({
        msg: '主题不能为空！',
        success: () => console.log('showToast完成')
      })
    }
  }, 3000),

  requestAddThemeData: function (openid, cusAddTheme, nickName){
    var params = {
      "openId": openid,
      "themeName": cusAddTheme,
      "nickName": nickName
    }
    api.postRequest('addBucket', params).then(res => {
      console.log(res.data)
      this.setData({
        hiddenmodalput: true,
        bucketList: res.data //请求结果数据
      })
    }).catch(e => {
      console.log(e)
    })
  },

  // 拿到手机号
  addThingsInput: function (e) {
    var addTheme = e.detail.value;
    this.setData({
      addTheme: addTheme
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
    }).then(res => {
      // output: res.result === 3
      console.log('[云函数] [login] user openid: ', res.result.openid)
      if (res.result.openid){
        that.refreshIndexData(res.result.openid)
      }
      

    }).catch(err => {
      // handle error
    });
   

    //绘制背景
    // this.drawProgressbg();
    // //开始progress
    // this.startProgress();
  },
  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({
        // logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })

      console.log('获取数据222222============' + this.data.userInfo.avatarUrl + "=====" + this.data.userInfo.nickName)
      wx.navigateTo({
        url: `../mine/mine?avatarUrl=${this.data.userInfo.avatarUrl}&nickName=${this.data.userInfo.nickName}`
      });
    }
    // if (e.detail.userInfo) {
     
    // }
  },

  //轮播图的切换事件
  swiperChange: function(e) {
    console.log("当前点击========", e.detail.current);
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  bucketListDetailAction: util.throttle(function (e) {
    let index = e.currentTarget.dataset.index
    let bucketList = this.data.bucketList[index]
    console.log("当前点击========" + index + '=====' + bucketList.themeId);
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
    }).then(res => {
      // output: res.result === 3
      console.log('[云函数] [login] user openid: ', res.result.openid)
      wx.navigateTo({
        url: `../addThemeBucket/addThemeBucket?themeId=${bucketList.themeId}&openid=${res.result.openid}`
      });
    }).catch(err => {
      // handle error
    });

  },3000),










  /**
   * 画progress底部背景
   */
  drawProgressbg: function() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg')
    // 设置圆环的宽度
    ctx.setLineWidth(4);
    // 设置圆环的颜色
    ctx.setStrokeStyle('#000000');
    // 设置圆环端点的形状
    ctx.setLineCap('round')
    //开始一个新的路径
    ctx.beginPath();
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.arc(40, 40, 20, 0, 2 * Math.PI, false);
    //对当前路径进行描边
    ctx.stroke();
    //开始绘制
    ctx.draw();
  },

  /**
   * 画progress进度
   */
  drawCircle: function(step) {
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('canvasProgress');
    // 设置圆环的宽度
    context.setLineWidth(4);
    // 设置圆环的颜色
    context.setStrokeStyle('#FBE6C7');
    // 设置圆环端点的形状
    context.setLineCap('round')
    //开始一个新的路径
    context.beginPath();
    //参数step 为绘制的圆环周长，从0到2为一周 。 -Math.PI / 2 将起始角设在12点钟位置 ，结束角 通过改变 step 的值确定
    context.arc(40, 40, 20, -Math.PI / 2, step * Math.PI - Math.PI / 2, false);
    //对当前路径进行描边
    context.stroke();
    //开始绘制
    context.draw()
  },

  /**
   * 开始progress
   */
  startProgress: function() {
    this.setData({
      count: 20
    });
    // // 设置倒计时 定时器 每100毫秒执行一次，计数器count+1 ,耗时6秒绘一圈 
    var strat_num = 0
    this.countTimer = setInterval(() => {
      if (strat_num <= this.data.count) {
        this.drawCircle(strat_num / (100 / 2))
        // this.setData({
        //   progress_txt: strat_num + "%",
        // })
        strat_num++;
      }
    }, 100)
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮后需要处理的逻辑方法体
      //var that = this;


    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
 
})