const Comments = require("./comment.model");
const asyncHandler = require("../../common/asyncHandler/async");
const { successResponse, failResponse } = require("../../common/responseHandler/response");
const {sendMail, sendSms} = require("../../common/functions/universal")
exports.postComment = asyncHandler(async (req, res) => {
  const { productId, comment } = req.body
  let post = {
    comment,
    sender: req.authUser.id,
    senderInfo: {
      fName: req.authUser.fName,
      lName: req.authUser.lName
    },
    replys:[]
  }

  // console.log(post)
  let commentPayload = {
    productId,
    comments: [
      post,
      
    ]
  }
  let postedComment = await Comments.findOneAndUpdate({ productId }, {
    '$push': {
      comments: post
    }
  }, {
    new: true
  })

  if (postedComment) {
    let subject = 'TRADEDEPOT - Comment Notification'
  let msg = `${req.authUser.fName} ${req.authUser.lName} just made a comment on your product. Visit to reply this comment`
 
    let resp = await sendMail({ to: req.authUser.email, subject, msg })
 
  return successResponse(res, postedComment)
}
 
  postedComment = await Comments.create(commentPayload)
  
  let subject = 'TRADEDEPOT - Comment Notification'
  let msg = `${req.authUser.fName} ${req.authUser.lName} just made a comment on your product. Visit to reply this comment`
  let resp = await sendMail({ to: req.authUser.email, subject, msg })
  
  return successResponse(res, postedComment)
})

exports.replyComment = asyncHandler(async (req, res) => {
  const { productId, commentId, comment } = req.body
  let post = {
    reply: comment,
    sender: req.authUser.id,
    senderInfo: {
      fName: req.authUser.fName,
      lName: req.authUser.lName
    }
  }
  // console.log(req.authUser)
  // console.log(post)

  let replies = await Comments.findOneAndUpdate({
     productId, 'comments._id':commentId
  }, {
    '$push': {
      'comments.$.replys': post
    }
  }, {
    new: true
  })

  let subject = 'TRADEDEPOT - Comment Notification'
  let msg = `${req.authUser.fName} ${req.authUser.lName} just replied your comment. Visit to reply this comment`
 
   let resp = await sendMail({ to: req.authUser.email, subject, msg })
     
  return successResponse(res, replies)
})

exports.fetchComment = asyncHandler(async (req, res) => {
  let id = req.params.id
  const comments = await Comments.findOne({ productId: id })
  if (!comments) {
    return successResponse(res, {
      data: {
        comments: []
      }
    })
  }
  return successResponse(res, comments)
})


exports.sendMail = asyncHandler(async (req, res) => {
  let resp = await sendMail()
  return successResponse(res, resp)
})


exports.sendSMS = asyncHandler(async (req, res) => {
  let payload = {
    to: 2347062521707,
    from: 'Trade Depot',
    text: "Test"
  }
  let resp = await sendSms(payload)
})


