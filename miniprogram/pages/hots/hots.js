// miniprogram/pages/hots/hots.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  /**
   * 获取电影数据列表 已知总数为15个
   */
  getMovie(callback) {
    wx.showLoading({
      title: '电影数据加载中',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'movielist',
      success: (result) => {
        console.log(result)
        wx.hideLoading()
        if (result.result.data.length) {
          this.setData({
            movieList: result.result.data
          })
        }
        else {
          wx.showToast({
            icon: 'none',
            title: '加载失败',
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
        wx.hideLoading()
        callback && callback();
      }
    });


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie()
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
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    console.log("refresh executed!")
    this.getMovie(() => {
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