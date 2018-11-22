// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  console.log(context)
  try {
    return await db.collection('movies').where({
      _id: event._id
    })
      .get()
  } catch (e) {
    console.error(e)
  }
}