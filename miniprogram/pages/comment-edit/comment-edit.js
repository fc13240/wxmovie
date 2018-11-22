// miniprogram/pages/comment-edit/comment-edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    movie: {},
    // commentType: 0: 文字；1：录音
    commentType: 0,
    // recordStatus: 区分正在录音还是未在录音
    recordStatus: false,
    commentText: '',
    commentVoice: '',
    voiceLength: 0,
    playing: false // 试听声音的状态标志
  },
  /***输入的文字评论 */
  onInput(event) {
    this.setData({
      commentText: event.detail.value.trim()
    })
  },


  /*** 输入的录音评论*/
  onRecord() {
    const recorderManager = wx.getRecorderManager()
    // 录音时长1min 
    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }

    if (!this.data.recordStatus)
      recorderManager.start(options)
    else
      recorderManager.stop()

    recorderManager.onStart(() => {
      console.log('recorder start')
    })
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const {
        tempFilePath
      } = res
      this.setData({
        commentVoice: tempFilePath,
        voiceLength: Math.round(res.duration / 1000)
      })
    })

    this.setData({
      recordStatus: ~this.data.recordStatus
    })

  },
  /**播放预览录音 */
  onRecordPreview() {
    //console.log(this.data.commentVoice)
    this.innerAudioContext.src = this.data.commentVoice
    // 切换播放状态
    if (!this.data.playing) //没有播放
      this.innerAudioContext.play()
    else
      this.innerAudioContext.stop();

    this.innerAudioContext.onPlay(() => {
      console.log("播放");
      this.setData({
        playing: true
      })
    })
    this.innerAudioContext.onStop(() => {
      console.log("停止");
      this.setData({
        playing: false
      })
    })
    this.innerAudioContext.onEnded(() => {
      console.log("自然停止");
      this.setData({
        playing: false
      })
    })
  },
  uploadVoice(cb) {
    console.log('上传录音文件')
    let nameStr = this.data.commentVoice.split('.');
    let cloudPath = `${nameStr[nameStr.length - 2]}.${nameStr[nameStr.length - 1]}`;

    console.log(this.data.commentVoice)
    wx.cloud.uploadFile({
      cloudPath: '/6d6f-movie-e0f89a/comment-upload/' + cloudPath,
      filePath: this.data.commentVoice, // 小程序临时文件路径
      success: res => {
        // get resource ID
        console.log(res.fileID)
      },
      fail: err => {
        // handle error
      }
    })

  },
  /** 上传语音评论信息 */
  onTapAddComment() {
    let commentVoice = this.data.commentVoice
    if (!commentVoice)
      return
    wx.showLoading({
      title: '评论上传中。。。',
    })
    this.uploadVoice(voiceUrl => {
      console.log(voiceUrl)
      console.log(this.data.voiceLength)

      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'comentadd',
        data: {
          movie_id: this.data.movie._id,
          voices: voiceUrl,
          voice_length: this.data.voiceLength,
          nickName: this.data.userInfo.nickName,
          avatarUrl: this.data.userInfo.avatarUrl
        },
        success: (result) => {
          console.log(result)
          wx.hideLoading()
          if (result.result.data.length) {
            wx.showToast({
              title: '评论成功',
            })
            //  评论成功后跳转到影评列表页面
            wx.navigateTo({
              url: `../comments-list/comments-list?id=${this.data.movie._id}`,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '评论失败',
            })
          }

        },
        fail: result => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '评论失败了',
          })
          console.log('error!' + result);
        }
      });


    })

  },

  onGotUserInfo(res) {

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
      // output: res.result === 3
      console.log("res1:", res1)

    }).catch(err => {
      // handle error
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    let commentType = options.type
    this.setData({
      commentType
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'moviedetails',
      // 传递给云函数的event参数
      data: {
        _id: options.movieID
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


    // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
    this.innerAudioContext = wx.createInnerAudioContext()
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
    this.innerAudioContext.stop();
    console.log("onUnload: Stop Playing!")
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