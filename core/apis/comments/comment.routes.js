const express = require("express");
const router = express.Router();

const {postComment, sendMail, replyComment, fetchComment, sendSMS } = require("./comment.controller");
const { protect } = require("../../common/authMiddleware/auth");


router.route("/post").post(protect,postComment);
router.route("/reply").post(protect, replyComment)
router.route("/:id").get(protect, fetchComment)
router.route("/sendmail").post(sendMail)
router.route("/sendSms").post(sendSMS)
module.exports = router;
