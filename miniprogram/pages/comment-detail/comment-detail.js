// miniprogram/pages/comment-detail/comment-detail.js
const app = getApp()

//oprBtnType: 确定未登录时跳转到登录界面登陆后的跳转逻辑
//收藏按钮 跳转回原页面；写影评按钮 跳转到编辑影评页面
const UNDEFINED = 0;
const ADD_FAVOR = 1;
const WRITE_COMMENT = 2;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    movie: {},
    commentUser: {},//该用户对该电影的评价

    needUserInfo: false,
    oprBtnType: UNDEFINED,
    userInfo: null,

    playing: false, //录音影评是否为播放状态

    isFavorite: false,
    showOrHidden: false //判断是否显示写影评按钮，true表示显示，反之隐藏

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
        avatarUrl
          : res.detail.userInfo.avatarUrl,
        city
          :
          res.detail.userInfo.city,
        country
          :
          res.detail.userInfo.country,
        gender
          :
          res.detail.userInfo.gender,
        language
          :
          res.detail.userInfo.language,
        nickName
          :
          res.detail.userInfo.nickName,
        province
          :
          res.detail.userInfo.province
      }
    }).then(res1 => {
      // output: res.result === 3
      console.log("res1:", res1)

    }).catch(err => {
      // handle error
    })

  },


  /***
 * 获取该用户对该电影的评论
 * 登陆之后调用 
 */
  getUserComment({ movie_id, cb }) {
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'commentuser',
      // 传递给云函数的event参数
      data: {
        movie_id: movie_id
      }
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      wx.hideLoading()
      cb & cb(res.result.data)
    }).catch(err => {
      // handle error
    })
  },


  // get the specific comment
  getComment(id) {
    wx.showLoading({
      title: '评论数据加载中',
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'commentdetails',
      // 传递给云函数的event参数
      data: {
        id: id
      }
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      wx.hideLoading()
      this.setData({
        comment: res.result.data[0]
      })


      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'moviedetails',
        // 传递给云函数的event参数
        data: {
          _id: res.result.data[0].movie_id
        }
      }).then(res => {
        // output: res.result === 3
        console.log("res:", res)
        wx.hideLoading()
        this.setData({
          movie: res.result.data[0]
        })

        this.getUserComment({
          movie_id: res.result.data[0]._id,
          cb: res => {
            console.log(res)
            if (res.length)//有评论 跳转到该评论的影评详情页面
            {

            } else {
              this.setData({
                showOrHidden: true
              })
            }
          }
        })

      }).catch(err => {
        // handle error
      })


    }).catch(err => {
      // handle error
    })

  },

  //判断该影评是否已经被收藏
  isFavorite(id) {
    wx.showLoading({
      title: '正在查询是否收藏本影评。。',
    })

    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'isfavorite',
      // 传递给云函数的event参数
      data: {
        comment_id: id
      }
    }).then(res => {
      // output: res.result === 3
      console.log("res:", res)
      wx.hideLoading()
      if (res.result.data.length)
        this.setData({
          isFavorite: true
        })
      else
        this.setData({
          isFavorite: false
        })
    }).catch(err => {
      // handle error
    })

  },

  onTapWriteComment() {
    this.data.oprBtnType = WRITE_COMMENT
    if (this.data.userInfo) {
      //已有登录信息，显示原始页面
      //获取该用户对该电影的评价信息
      this.getUserComment({
        movie_id: this.data.movie._id,
        cb: res => {
          console.log(res)
          if (res)//有评论 跳转到该评论的影评详情页面
          {
            wx.navigateTo({
              url: `../comment-detail/comment-detail?id=${res[0]._id}`,
            })
          } else {//无评论 弹出底部菜单，添加影评，跳转到影评编辑页面
            this.showActionSheet()
          }
        }
      })

    } else {
      //没有登录信息，显示登录授权页面
      this.setData({
        needUserInfo: true
      })
    }
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

  // 收藏影评按钮
  onTapAddFavor() {
    this.data.oprBtnType = WRITE_COMMENT
    //有登录信息
    if (this.data.userInfo) {
      //已有登录信息，显示原始页面
      this.setData({
        needUserInfo: false
      })

      wx.showLoading({
        title: '添加收藏中。。。',
      })

      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'favoriteadd',
        // 传递给云函数的event参数
        data: {
          commentId: this.data.comment._id,
          isfavorite: this.data.isFavorite//已经收藏 正在取消收藏;未收藏，添加收藏
        }
      }).then(res => {
        // output: res.result === 3
        console.log("res:", res)
        wx.hideLoading()
        if (res.result.length)
          wx.showToast({
            title: '取消收藏',
          })
        else
          wx.showToast({
            title: '收藏成功',
          })
        this.isFavorite(this.data.comment._id)
      }).catch(err => {
        // handle error
        console.log(err)
        wx.hideLoading()
      })


    } else {
      //没有登录信息，显示登录授权页面
      this.setData({
        needUserInfo: true
      })
    }
  },


  /**
  * 点击播放按钮： 播放或停止播放音频
  */
  onTapPlay() {
    let comment = this.data.comment
    if (comment.voices) {
      this.innerAudioContext.src = comment.voices
      // 切换播放状态
      if (!this.data.playing)//没有播放
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
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 查看是否授权
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                userInfo: res.userInfo
              })
              app.globalData.userInfo = res.userInfo
            },
            fail(res) {
              if (app.globalData.userInfo) {
                that.setData({
                  userInfo: app.globalData.userInfo
                })
              }
            }
          })
        } else {
          if (app.globalData.userInfo) {
            that.setData({
              userInfo: app.globalData.userInfo
            })
          }
        }
      },
      fail(res) {
        if (app.globalData.userInfo) {
          that.setData({
            userInfo: app.globalData.userInfo
          })
        }
      },
      complete() {
        let commentID = options.id

        that.getComment(commentID)

        that.isFavorite(commentID)




        // 这里为什么放到函数onTapPlay中是不行的（if中可以调用，else中不行）
        that.innerAudioContext = wx.createInnerAudioContext()

      }
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
    this.innerAudioContext.stop();
    console.log("onUnload: Stop Playing!")
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