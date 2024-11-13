const Conversation = require('../modal/conversation.modal');
const Message = require('../modal/message.modal')

module.exports.createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        const existingConversation = await Conversation.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConversation = new Conversation({ senderId, receiverId });
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.messagesForConversation = async (conversationId) => {
    // console.log(conversationId,'conversationId')
    try {
        const messages = await Message.find({ conversationId: conversationId }).lean();

        messages.forEach((message) => {
            if (message.audio) {
                message.audio = message.audio.toString('base64');
            }
        });

        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

module.exports.CreateNewMessages = async (body) => {
    try {
        const newMessage = await Message.create(body)
        return newMessage
    } catch (error) {
        return {}
    }
};

module.exports.deleteMessage = async (messageId, senderId) => {
    console.log(messageId, senderId, 'messageId, senderId');
    try {
        const messageDetails = await Message.findOne({ _id: messageId, senderId });
        if (messageDetails) {
            await Message.deleteOne({ _id: messageId, senderId });
            return { message: "Message deleted successfully." };
        } else {
            return { message: "Message not found." };
        }
    } catch (error) {
        console.error("Error deleting message:", error);
        return { message: "Something went wrong." };
    }
};

module.exports.editMessage = async (messageId, senderId, message) => {
    try {
      const messageDetails = await Message.findOne({
        _id: messageId,
        senderId: senderId,
      });
  
      if (messageDetails) {
        await Message.updateOne(
          {
            _id: messageId,
            senderId: senderId,
          },
          {
            message: message,
            updated_at: new Date(),
          }
        );
        return { message: "Message updated successfully." };
      } else {
        return { message: "Message not found." };
      }
    } catch (error) {
      console.log("error:", error);
      return { message: "An error occurred." };
    }
  };
