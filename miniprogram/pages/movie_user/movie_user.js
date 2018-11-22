// miniprogram/pages/movie_user/movie_user.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    favorList: [],
    myCommentList: [],
  },

  /***
   * 同时获取favorList myCommentList
   */
  getUserInterestLists() {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'favoritelist'
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      wx.hideLoading()
      this.setData({
        favorList: res.result.favorList,
        myCommentList: res.result.myCommentList
      })
    }).catch(err => {
      console.log("err:", err);
    })
  },

  onGotUserInfo(res) {
    wx.showLoading({
      title: '电影数据加载中',
    })
    console.log(res.detail.errMsg)
    console.log(res.detail.userInfo)
    console.log(res.detail.rawData)
    this.setData({
      userInfo: res.detail.userInfo
    })

    app.globalData.userInfo = res.detail.userInfo
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'useradd',
      data: {
        avatarUrl: res.detail.userInfo.avatarUrl,
        city: res.detail.userInfo.city,
        country: res.detail.userInfo.country,
        gender: res.detail.userInfo.gender,
        language: res.detail.userInfo.language,
        nickName: res.detail.userInfo.nickName,
        province: res.detail.userInfo.province
      }
    }).then(res1 => {
      console.log("res1:", res1)
      this.getUserInterestLists()
    }).catch(err => {
      console.log("err:", err);
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    if (this.data.userInfo)
      this.getUserInterestLists()
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