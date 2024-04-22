const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  amount_paid: {
    type: Number,
    required: true,
  },
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lentTo: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  date: {
    type: String,
    default: Date.now(),
  },
  lentedAmount: {
    type: Number,
  },
  totalLentedAmount: {
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  notes: [
    {
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: String,
        default: Date.now(),
      },
      amount: {
        original: {
          type: Number,
        },
        updated: {
          type: Number,
        },
      },
      description: {
        original: {
          type: String,
        },
        updated: {
          type: String,
        },
      },
    },
  ],
  comments: [
    {
      commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
  ],
});

// transactionSchema.pre("remove", function (next) {
//   const Comment = mongoose.model("Comment");
//   const commentIds = this.comments.map((comment) => comment.commentId);
//   // Delete comments associated with this transaction
//   Comment.deleteMany({ _id: { $in: commentIds } })
//     .then(() => next())
//     .catch((err) => next(err));
// });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
