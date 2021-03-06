// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  console.log(context)

  try {
    return await db.collection('favorites').where({
      comment_id: event.comment_id,
      openId: event.userInfo.openId
    })
      .get()
  } catch (e) {
    console.error(e)
  }
}