// miniprogram/pages/comments-list/comments-list.js
let movieID
const util = require('../../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
  },

  /**
   * 获取电影评论数据列表
   */
  getComments(callback) {
    wx.showLoading({
      title: '电影评论数据加载中',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'commentlist',
      data: {
        movie_id: movieID
      },
      success: (result) => {
        console.log(result)
        wx.hideLoading()
        if (result.result.data.length) {
          this.setData({
            movieList: result.result.data
          })
          this.setData({
            commentList: result.result.data.map(item => {
              let itemDate = new Date(item.create_time)
              item.createTime = util.formatTime(itemDate)
              return item
            })
          })

        }

      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '加载失败',
        })
        console.log('error!' + result);
      },
      complete: () => {
        callback && callback();
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    movieID = options.id
    this.getComments()
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
    console.log("refresh executed!")
    this.getComments(() => {
      wx.stopPullDownRefresh();
    });
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