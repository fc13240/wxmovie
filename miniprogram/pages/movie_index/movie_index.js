// miniprogram/pages/movie_index/movie_index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: null,
    comment: null
  },

  //获取某个范围随机整数的方法
  selectFrom(lowerValue, upperValue) {
    let choices = upperValue - lowerValue + 1
    return Math.floor(Math.random() * choices + lowerValue)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '电影列表加载中...',
    })
    let randomId = this.selectFrom(1, 15)
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'movierandom',
      // 传递给云函数的event参数
      data: {
        idnumber: randomId
      }
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      //wx.hideLoading()
      this.setData({
        movie: res.result.data[0]
      })
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'commentlist',
        // 传递给云函数的event参数
        data: {
          movie_id: res.result.data[0]._id
        }
      }).then(res => {
        // output: res.result === 3
        console.log("res:", res)
        wx.hideLoading()
        let commentList = res.result.data
        if (commentList.length) {
          // console.log("comment:" + commentList.length)
          this.setData({
            comment: commentList[Math.floor((Math.random() * commentList.length))]
          })
        } else {
          // console.log("no comment")
          this.setData({
            comment: null
          })
        }

      }).catch(err => {
        // handle error
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