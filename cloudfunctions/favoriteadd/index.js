// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  console.log(context)
  let openId = event.userInfo.openId
  let commentId = event.commentId
  let isfavorite = event.isfavorite
  let createTime = new Date()

  if (isfavorite) {//已收藏 取消收藏
    try {
      return await db.collection('favorites').where({
        openId: openId,
        comment_id: commentId
      }).remove()
    } catch (e) {
      console.error(e)
    }
  } else {//未收藏 添加收藏
    try {
      return await db.collection('favorites').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          openId: openId,
          comment_id: commentId,
          createTime: createTime
        }
      })
    } catch (e) {
      console.error(e)
    }
  }


}