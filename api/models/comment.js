const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  owner: {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true }, //reference to the User model
    username: { type: String },
  },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
