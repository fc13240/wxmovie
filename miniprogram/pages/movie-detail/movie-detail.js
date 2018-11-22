// miniprogram/pages/movie-detail/movie-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },
  // 底部弹出按钮菜单
  showActionSheet() {
    let movieID = this.data.movie._id
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
        console.log("Comment Type is: " + res.tapIndex)
        wx.navigateTo({
          url: `../comment-edit/comment-edit?type=${res.tapIndex}&movieID=${movieID}`,
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '电影详情加载中...',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'moviedetails',
      // 传递给云函数的event参数
      data: {
        _id: options.id
      }
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      wx.hideLoading()
      this.setData({
        movie: res.result.data[0]
      })
    }).catch(err => {
      // handle error
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