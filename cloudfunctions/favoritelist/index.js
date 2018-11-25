// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event)
  console.log(context)

  let favorList = []
  let myCommentList = []

  try {
    let moviesList = await db.collection('movies')
      .skip(0)
      .limit(100)
      .get()
    console.log("moviesList.data:", moviesList.data)
    await Promise.all(moviesList.data.map(async (movie) => {
      //耗时操作
      let movie_id = movie._id

      console.log("movie_id:", movie_id)
      let CommentList = await db.collection('comment').where({
        movie_id: movie_id,
        openId: event.userInfo.openId
      })
        .get()
      console.log("CommentList.data:", CommentList.data)
      await Promise.all(CommentList.data.map(async (comment) => {
        //耗时操作
        let comment_id = comment._id

        console.log("comment_id:", comment_id)
        let FavorsList = await db.collection('favorites').where({
          comment_id: comment_id,
          openId: event.userInfo.openId
        }).get()
        console.log("FavorsList.data:", FavorsList.data)


        await Promise.all(FavorsList.data.map(async (favorite) => {
          console.log(favorite)
          favorList.push({
            "comment_id": comment_id,
            "image": movie.image,
            "title": movie.title,
            "nickname": comment.nickName,
            "avatar": comment.avatarUrl,
            "content": comment.content,
            "voices": comment.voices,
            "voice_length": comment.voice_length
          })
        }));


        myCommentList.push({
          "comment_id": comment_id,
          "image": movie.image,
          "title": movie.title,
          "content": comment.content,
          "voices": comment.voices,
          "voice_length": comment.voice_length
        })

      }));


    }));



    return { "favorList": favorList, "myCommentList": myCommentList }
  } catch (e) {
    console.error(e)
    return { "favorList": favorList, "myCommentList": myCommentList }
  }
}