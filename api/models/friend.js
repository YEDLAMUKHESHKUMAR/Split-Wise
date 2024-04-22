const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const User = require("./user");
// const Transaction = require("./transaction");

const friendSchema = new Schema({
  mergeId: {
    type: String,
    required: true,
    unique: true,
  },
  user1: {  // owner 
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  transactions: [
    {
      transactionId: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    },
  ],
  settledTransactions: [
    {
      transactionId: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    },
  ],
  owe: {
    type: Number,
    default: 0,
  },
});

const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
