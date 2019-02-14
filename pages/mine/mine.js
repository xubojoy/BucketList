// index.js
// 获取应用实例
const app = getApp()

var user = wx.getStorageSync('user') || {};
var userInfo = wx.getStorageSync('userInfo') || {};

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pics: [],
    count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    isShow: true,
    avatarUrl:'',
    nickName: '',
    pagesArray: [
      {
        zh: '关于',
        url: 'get-user-info/get-user-info',
        imageName: "about_64.png"
      }
    ]
  },


// {
//     zh: '分享',
//     url: 'uploadPic/uploadPic',
//     imageName: "share_64.png"
//   }, 


  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    isShow: (options.isShow == "true" ? true : false)
    // var pages = options.data.pagesArray
    // console.log(pages);


    let {
      avatarUrl
    } = options

    let {
      nickName
    } = options
    this.setData({
      avatarUrl: avatarUrl,
      nickName: nickName

    })

    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else if (this.data.pagesArray) {
      this.setData({
        pagesArray: options.data.pagesArray
      })
    }
    else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  weuicellTapAction: function(e){
    var cellTitle = e.currentTarget.dataset.location
    console.log("当前点击cellTitle===========" + cellTitle)

    if (cellTitle == '分享'){
      // this.onShareAppMessage()
      wx.navigateTo({
        url: '../share/share'
      });
    }else if(cellTitle == "关于"){
      wx.navigateTo({
        url: '../about/about'
      });
    }

  }
})