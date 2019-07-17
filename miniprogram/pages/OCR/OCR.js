// pages/OCR/OCR.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   log:'OCR',
   tempFilePath:'',//图像路径
   resultstring:"",//识别结果
  },
  //获取图片
  chooseimage:function(){
    var _this = this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        _this.setData({
          tempFilePaths: res.tempFilePaths
        }) 
      },
    })
  },
  //OCR
  imageOCR:function(){
    wx.showLoading({ 'title': '识别中' });//提示框
    var CryptoJS = require('../../lib/crypto-js/crypto-js');//引入CryptoJS模块
    var now = Math.floor(Date.now() / 1000);//生成时间戳Timestamp
    var expired = now + 1000;//生成过期时间
    var secret_src = 'a=' + app.globalData.appid + '&b=' + '&k=' + app.globalData.secretid + '&e=' + expired + '&t=' + now + '&r=' + '123' + '&f=';//按照开发文档拼接字符串
    var auth_b = CryptoJS.HmacSHA1(secret_src, app.globalData.secret).concat(CryptoJS.enc.Utf8.parse(secret_src));//完成加密算法
    var auth = auth_b.toString(CryptoJS.enc.Base64);//按要求获取base64字符串
    var that = this;
    // time = Date.now();
    wx.uploadFile({
      url: 'https://recognition.image.myqcloud.com/ocr/handwriting',
      filePath: this.data.tempFilePaths[0],
      name: 'image',
      header:{
        'authorization': auth//header按照文档填写
      },
      formData: {
        'appid': app.globalData.appid
      },
      success: function (res) {
        wx.hideLoading();
        var data = res.data;
        that.display(data);
      }
    })
  },
  display(data){
    var result = JSON.parse(data);
    if (result.code!=0){
      //非正常情况
      console.log(result.message)
      wx.showModal({ 'title': '错误', 'content': '服务暂不可用\ncode:' + result.code + '\nmsg:' + result.message, 'showCancel': false });
    }
    else{
      var out = "识别到了：\n";
      for (var i = 0; i < result.data.items.length; i++) {
        out = out + '[' + i + ']' + ' ' + result.data.items[i].itemstring + '\n';//识别返回结果的拼接
      }
      // var last = Date.now() - time;//停止计时
      // this.setData({ time: ' 用时:' + last + 'ms' });//显示
      console.log(result);//控制台记录结果，以便调试
      this.setData({ "resultstring": out });
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
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
    } else {
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
  OCR:function(){
    wx.redirectTo({
      url: '../home/index',
    })
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
