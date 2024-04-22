const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, //transform the email to lower case letters
    trim: true, //remove any white spaces at the beginning and end of the string
  },
  password: { type: String, required: true },
  friends: [
    {
      userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  transactions: [
    {
      transactionId: {
        type: Schema.Types.ObjectId,
        ref: "Transaction",
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

// transactions: [
//     {
//         type: Schema.Types.ObjectId,
//         ref: 'Transaction'
//     },
// ],
// friends: [
//     {
//       userID: {
//         type: Schema.Types.ObjectId,
//         ref: "User",
//       },
//     },
//   ],
