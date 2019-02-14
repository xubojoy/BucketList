var userInfo = wx.getStorageSync('userInfo') || {};
const user = wx.getStorageSync('user') || {};
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
import {
  Toast
} from '../../wxu/wxu'
Page({

  /**
   * 页面的初始数据 friend.jpg  green.png
   */
  data: { //cloud://dev-1234.6465-dev-1234/img/green.png
    shareBgImage: "cloud://dev-1234.6465-dev-1234/img/bg.JPG",
    bgImgUrl: 'https://6465-dev-1234-1258449915.tcb.qcloud.la/img/bg.JPG?sign=afa8df0d8382cf96fa4bd6fc69178d95&t=1547188816',
    excerptWordEN: '',
    excerptWordCH: '',
    year: '',
    mon: '',
    day: '',
    week: '',
    maskHidden: true,
    imagePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      shareBgImage: this.data.shareBgImage
    })

    this.requestExcerptWordData()

    this.getCurrentMonthFirst()
    // this.createCanvasImg()

    var size = this.setCanvasSize(); //动态设置画布大小

    console.log("size=======" + size.w + '==========' + size.h)
  },

  requestExcerptWordData: function() {
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

  // 获取当前时间
  getCurrentMonthFirst: function() {
    var date = new Date();
    // var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    // return todate;
    let dateObj = {};
    let show_day = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    // let date = new Date(dates);
    // date.setDate(date.getDate());
    let day = date.getDay();
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth());
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    this.setData({
      year: dateObj.year,
      mon: dateObj.month,
      day: dateObj.day,
      week: dateObj.week
    })



    console.log('===当前星期==========' + dateObj.week)

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
    return {
      title: "愿望小清单",
        // 默认小程序的名称
      path: '/pages/share/share', // 默认是当前页面，必须是以‘/’开头的完整路径（可以写其它页面的地址，）
      // imgUrl: '',   //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4   
      success(e) {
        if (e.shareTickets) {
          wx.getShareInfo({
            shareTicket: e.shareTickets[0], //shareticket参数是上边函数成功回调返回的
            success: function(e) {
              e.errMsg; // 错误信息
              e.encryptedData;  //  解密后为一个 JSON 结构（openGId    群对当前小程序的唯一 ID）
              e.iv; // 加密算法的初始向量
              console.log("return outcome", e)
            }
          })
        }
      } 
    }
  },

  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 217; //画布宽度
      var scaleH = 342 / 217; //生成图片的宽高比例
      var width = res.windowWidth; //画布宽度
      var height = res.windowWidth * scaleH; //画布的高度
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);

    }
    return size;

  },


  saveTimeLineImage: function() {
    this.createCanvasImg()

  },

  createCanvasImg: function() {
    var that = this
    var that = this;
    var size = that.setCanvasSize();
    var ctx = wx.createCanvasContext('shareFriends')
    // ctx.drawImage('../../images/love.jpg', 0, 0, size.w, size.h);
    //主要就是计算好各个图文的位置
    wx.downloadFile({
      url: that.data.bgImgUrl,
      success: function(res) {
        if (res.tempFilePath) {
          console.log('res.tempFilePath=======' + res.tempFilePath)
          ctx.drawImage(res.tempFilePath, 0, 0, size.w, size.h);
          // context.draw(true, that.getTempFilePath);
        }
      }
    })
    // ctx.drawImage('../../' + res[0].path, 0, 0, size.w, size.h)
    // ctx.drawImage('../../' + res[1].path, 0, 0, 545, 771)

    // ctx.setTextAlign('center')
    // ctx.setFillStyle('#ffffff')
    // ctx.setFontSize(22)
    // ctx.fillText('分享文字描述1', 545 / 2, 130)
    // ctx.fillText('分享文字描述2', 545 / 2, 160)

    ctx.stroke()
    ctx.draw()
    // })
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 2000

    });
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'shareFriends',
        success: function(res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: false,
            maskHidden: true,
          });　　　　　　　　 //将生成的图片放入到《image》标签里
          // var img = that.data.imagePath;
          // wx.previewImage({
          //   current: img, // 当前显示图片的http链接
          //   urls: [img] // 需要预览的图片http链接列表

          // })
          wx.getSetting({
            success(res) {
              // 如果没有则获取授权
              if (!res.authSetting['scope.writePhotosAlbum']) {
                wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    wx.saveImageToPhotosAlbum({
                      filePath: that.data.imagePath,
                      success() {
                        wx.showToast({
                          title: '保存成功'
                        })
                      },
                      fail() {
                        wx.showToast({
                          title: '保存失败',
                          icon: 'none'
                        })
                      }
                    })
                  },
                  fail() {
                    // 如果用户拒绝过或没有授权，则再次打开授权窗口
                    //（ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
                    that.setData({
                      openSet: true
                    })
                  }
                })
              } else {
                // 有则直接保存
                wx.saveImageToPhotosAlbum({
                  filePath: that.data.imagePath,
                  success() {
                    wx.showToast({
                      title: '保存成功'
                    })
                  },
                  fail() {
                    wx.showToast({
                      title: '保存失败',
                      icon: 'none'
                    })
                  }
                })
              }
            }
          })

        },
        // fail: function(res) {
        //   console.log(res);
        // }
      });
    }, 2000);
    // })
  }






})