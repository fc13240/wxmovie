// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  let openId = event.userInfo.openId
  let nickName = event.nickName
  let avatarUrl = event.avatarUrl

  let movieID = event.movie_id
  let content = event.content || null
  let voices = event.voices || null
  let voiceLength = event.voice_length || null
  let createTime = new Date()
  try {
    return await db.collection('comment').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openId: openId,
        nickName: nickName,
        avatarUrl: avatarUrl,
        content: content,
        voices: voices,
        voice_length: voiceLength,
        movie_id: movieID,
        createTime: createTime
      }
    })
  } catch (e) {
    console.error(e)
  }
}



