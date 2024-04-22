// Invitation schema (optional, for advanced tracking)
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const InvitationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipientEmail: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date, // Optional: Set expiration for the invitation
  },
});

const Invitation = mongoose.model("Invitation", InvitationSchema);

module.exports = Invitation;
