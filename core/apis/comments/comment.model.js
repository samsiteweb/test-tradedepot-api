const mongoose = require("mongoose");
const schema = mongoose.Schema;
const geocoder = require('../../common/functions/geocoder')


const commentSchema = new schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Products',
      required: true
    },
    comments: [
      {
        comment: { type: String },
        sender: {type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true
        },
        senderInfo: {
          fName: { type: String },
          lName:{ type: String}
        },
        createdAt: {type: Date, default:Date.now},
        replys: [
         { sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
         senderInfo: {
          fName: { type: String },
          lName:{ type: String}
        },
            reply: { type: String },
            createdAt: {type: Date, default:Date.now}
          }
        ]
        
      }
    ]

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



module.exports = mongoose.model("Comments", commentSchema);
