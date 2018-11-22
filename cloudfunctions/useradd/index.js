// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event:", event)
  console.log("context:", context)
  let openId = event.userInfo.openId
  let nickName = event.nickName
  let avatarUrl = event.avatarUrl
  let city = event.city
  let country = event.country
  let gender = event.gender
  let language = event.language
  let province = event.province
  let createTime = new Date()

  try {
    let count = await db.collection('users').where({
      // gt 方法用于指定一个 "大于" 条件，此处 _.eq()是获取与其相等的项
      openId: _.eq(openId)
    })
      .count();
    console.log("count:", count)
    if (count.total <= 0) {
      await db.collection('users').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          openId: openId,
          nickName: nickName,
          avatarUrl: avatarUrl,
          city: city,
          country: country,
          gender: gender,
          language: language,
          province: province,
          createTime: createTime
        }
      })
    }
    return { res: 1, msg: "用户添加成功" }
  } catch (e) {
    console.error(e)
  }

}