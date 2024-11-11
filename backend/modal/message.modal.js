const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
            required: true,
        },
        receiverId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
            required: true,
        },
        conversationId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        message: {
            type: String,
        },
        audio: {
            type: String,
        },
        file: {
            type: String,
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

module.exports = mongoose.model("Message", MessageSchema)

