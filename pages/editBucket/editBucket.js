const app = getApp()
const user = wx.getStorageSync('user') || {};
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
import {
  Toast
} from '../../wxu/wxu'
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmapwx/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editStatus: true,
    thing: null,
    happy: 0,
    txt: '',
    time: util.formatDate(new Date()),
    wallshow: false,
    region: ['北京市', '北京市', '海淀区'],
    sweethingid: 0,
    openid: '',
    bucketListId: 0,
    bucketListDetailData: {},
    themeId: 0,
    address: '北京市通州区西富河园西区',
    pics: [],
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
    isShow: (options.isShow == "true" ? true : false)
  
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
    console.log("======bucketListId========" + bucketListId, themeId)
    this.getCurrLocation()
    this.requestBucketListDetailDdata()
  },

  requestBucketListDetailDdata: function (){
    var params = {
      "openId": this.data.openid,
      "bucketListId": this.data.bucketListId
    }
    api.postRequest('queryBucketListDetail', params).then(res => {
      console.log("查询结果bucketListDetailData=======" + res.data)
      this.setData({
        bucketListDetailData: res.data //请求结果数据
      })
    }).catch(e => {
      console.log(e)
    });
  },

  getCurrLocation: function(){
    let that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'DK3BZ-FXHLJ-22QFJ-F3XUV-XZZOS-H4F4P' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        console.log('===当前地址=====' + res.latitude)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            console.log('===当前地址=====' + address)
            that.setData({
              address: address
            })
          },
          fail: function (err) {
            console.log('调用失败' + err)
          }
        })
      }
    });
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
  bindTimeChange(e) {
    console.log('bindTimeChange', e)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    console.log('bindRegionChange', e)
    // this.setData({
    //   region: e.detail.value
    // })

  },
  getLocationTap: function() {
    let that = this
    wx.chooseLocation({
      success: function(res) {
        console.log("最终获取地址===============" + res.address + res.name)
        that.setData({
          address: res.address + res.name
        })
      },
    })
  },


  switchChange(e) {
    // console.log('switchChange',e)
    this.setData({
      wallshow: e.detail.value
    })
  },
// 上传图片至小程序云平台
  doImgUpload: function (e) {
    var that = this;
    var pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        wx.showLoading({
          title: '上传中...',
        })
        const filePath = res.tempFilePaths,
          cloudPath = [];
        filePath.forEach((item, i) => {
          cloudPath.push('img/' + that.data.openid + 'TO' + that.data.bucketListId + 'TIME' + (+new Date()) + 'TIME' + i + '.jpg')
        });
        console.log(cloudPath)
        wx.cloud.init()
        filePath.forEach((item, i) => {
          let cloudPathStr = cloudPath[i]
          wx.cloud.uploadFile({
            cloudPath: cloudPathStr,
            filePath: filePath[i], // 小程序临时文件路径
          }).then(realpath => {
            wx.hideLoading()
            // 控制触发添加图片的最多时隐藏
            pics = pics.concat(realpath.fileID);
            if (pics.length >= 9) {
              that.setData({
                isShow: (!that.data.isShow)
              })
            } else {
              that.setData({
                isShow: (that.data.isShow)
              })
            }
            that.setData({
              pics: that.data.pics.concat(realpath.fileID)
            });
            console.log("=pics==============" + that.data.pics)
          }).catch(err => {
            wx.hideLoading()
            console.log(err)
          })
        });

      }
    })
  },




  // delPic(e) {
  //   this.setData({
  //     photos: ''
  //   })
  // },
  // editAll() {
  //   this.setData({
  //     editStatus: true
  //   })
  // },
  // save() {
    save: util.throttle(function (e) {
    var that = this
    this.setData({
      editStatus: false
    })
    let time = this.data.time.split('-')
    let timeStr = `${time[0]}-${time[1]}-${time[2]}`
    // let date = new Date(timeStr);
    // let region = this.data.region
    // let addr = `${region[0]}-${region[1]}-${region[2]}`
    // addr = addr.substring(0, addr.length - 1)
    let thing = this.data.bucketListDetailData.bucketName
    let picsStr = this.data.pics.join("|")
    console.log("图片路径========" + picsStr, this.data.address)
      if (picsStr) {
      var params = {
        "openId": this.data.openid,
        "bucketListId": this.data.bucketListId,
        "address": this.data.address,
        "finishedFlag": "1",
        "endTime": timeStr,
        "bucketPicUrl": picsStr,
        "bucketCoverUrl": this.data.pics[0]
      }
      console.log("图片params========" + params.bucketPicUrl)
      api.postRequest('updateBucketList', params).then(res => {
        console.log("查询结果bucketListDetailData=======" + res.data)
        this.setData({
          bucketListDetailData: res.data //请求结果数据
        })

        var updateParams = {
          "openId": this.data.openid,
          "themeId": this.data.themeId,
        }
        api.postRequest('updateBucket', updateParams).then(res => {
          console.log("更新后的数据=======" + res.data)
          var pages = getCurrentPages();
          console.log("=========获取数据======" + pages.length)
          // var currPage = pages[pages.length - 1];   //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面
          //给上级页面的变量赋值
          prevPage.setData({
            themeId: this.data.themeId
          })
          wx.navigateBack() //返回上级页面
        }).catch(err => {
          console.log(err)
        })
      }).catch(e => {
        console.log(e)
      })
    } else {
      Toast({
        msg: '打卡图片为证！',
        success: () => console.log('showToast完成')
      })
    }

  },3000),

  saveBucketList: function(openid){
    
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