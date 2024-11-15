const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    groupId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Group',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isSeen: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("Group_message", MessageSchema)

