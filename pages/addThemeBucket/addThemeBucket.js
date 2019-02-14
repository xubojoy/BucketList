
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
var Empty = require("../../libs/empty/constant/EmptyConstant.js");
const user = wx.getStorageSync('user') || {};
import { Toast } from '../../wxu/wxu'
var startPoint;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideList: [],
    hiddenmodalput: true,
    bucketStr:'',
    themeId: 0,
    animationData: {},
    buttonTop: 0,
    buttonLeft: 0,
    emptyType: Empty.loading,
    openid:''
    // loadingTransparent: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { themeId } = options
    let { openid } = options
    this.setData({
      themeId: parseInt(themeId),
      openid: openid

    })

    this.setData({
      emptyType: Empty.empty
    })
    console.log("======themeId========" + themeId)
    this.dataRequest()
  },

  emptyCallback: function (event) {
    var emptyType = event.detail.emptyType;
    if (emptyType == Empty.error) {
      wx.showToast({
        title: '加载错误中的按钮',
        icon: 'none',
        duration: 2000
      })
    } else if (emptyType == Empty.empty) {
      wx.showToast({
        title: '数据为空中的按钮',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // btnChangeloadingTransparentOnClick: function () {
  //   this.setData({
  //     loadingTransparent: this.data.loadingTransparent ^= true
  //   });
  // },

  dataRequest: function(){
    // 获取用户信息
    // var user = wx.getStorageSync('user') || {};
    console.log("=====想要获取openID==========" + this.data.openid)
    // 单个请求
    // 获取用户信息
    var params = {
      "openId": this.data.openid,
      "themeId": this.data.themeId
    }
    api.postRequest('queryAllBucketList', params).then(res => {
      console.log("查询结果=======" + res.data)
      this.setData({
        guideList: res.data //请求结果数据
      })
    }).catch(e => {
      console.log(e)
    })
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
  confirm: util.throttle(function (e) {

    var cusGuideList = this.data.guideList;
    // 单个请求
    if (this.data.bucketStr) {
      var params = {
        "openId": this.data.openid,
        "themeId": this.data.themeId,
        "bucketName": this.data.bucketStr
      }
      api.postRequest('addBucketList', params).then(res => {
        console.log(res.data)
        this.setData({
          hiddenmodalput: true,
          guideList: res.data
        })
      }).catch(e => {
        console.log(e)
      })
    } else {
      Toast({
        msg: '清单不能为空！',
        success: () => console.log('showToast完成')
      })
    }
  },3000),
  // 拿到手机号
  addThingsInput: function (e) {
    var bucketStr = e.detail.value;
    this.setData({
      bucketStr: bucketStr
    });
  },

  bucketListItemAction: function(e){
    var index = e.currentTarget.dataset.index
    console.log("当前点击清单item==========="+index)
    let bucket = this.data.guideList[index]
    console.log("bucket===========" + bucket.finishedFlag)
    if (bucket.finishedFlag == "1"){
      wx.navigateTo({
        url: `../bucketDetail/bucketDetail?bucketListId=${bucket.bucketListId}&themeId=${bucket.themeId}&openid=${this.data.openid}`
      });
    }else{
      wx.navigateTo({
        url: `../editBucket/editBucket?bucketListId=${bucket.bucketListId}&themeId=${bucket.themeId}&openid=${this.data.openid}`
      });
    }






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
    this.animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'ease',
    })
    console.log("===fanhuii===themeId========" + this.data.themeId)
    this.dataRequest()

  },
  buttonStart: function (e) {
    startPoint = e.touches[0]
  },
  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX

    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
    console.log(e);
    // var endPoint = e.changedTouches[0]
    // this.setData({
    //   buttonTop: (endPoint.clientY - 20),
    //   buttonLeft: (endPoint.clientX - 50)
    // })
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