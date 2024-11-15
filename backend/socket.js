
const messageService = require("./controllers/message.controller");
const groupChatService = require("./controllers/groupMessage.controller");

module.exports = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    let connectedUsers = {};
    io.on('connection', (socket) => {
        socket.on("connected", (userId) => {
            connectedUsers[userId] = socket.id
            io.emit("connectedUsers", Object.keys(connectedUsers))
        })

        socket.on("joinConversation", async (conversationId) => {
            socket.join(conversationId)
            const allMessages = await messageService.messagesForConversation(conversationId)
            socket.emit("allMessages", allMessages)
        })

        socket.on("message", async (data) => {
            const newMessage = await messageService.CreateNewMessages(data)
            socket.to(data.conversationId).emit("message", newMessage)
        })

        socket.on('typing', (data) => {
            io.to(data.conversationId).emit('user-typing', {
                userId: data.userId,
                conversationId: data.conversationId,
            });
        });

        socket.on('stop-typing', (data) => {
            io.to(data.conversationId).emit('user-stop-typing', {
                userId: data.userId,
                conversationId: data.conversationId,
            });
        });

        socket.on("delete-message", async ({ messageId, senderId, conversationId }) => {
            // console.log("Deleting message:", messageId, senderId, conversationId);

            await messageService.deleteMessage(messageId, senderId);
            const updatedMessages = await messageService.messagesForConversation(conversationId);
            socket.to(conversationId).emit("allMessages", updatedMessages);
        });

        socket.on(
            "edit-message",
            async ({ messageId, senderId, conversationId, message }) => {
                console.log(message)
                await messageService.editMessage(messageId, senderId, message);
                const updatedMessages = await messageService.messagesForConversation(conversationId);
                socket.to(conversationId).emit("allMessages", updatedMessages);
            }
        );


        ///////////////////// For Group Chat ///////////////////////

    socket.on('join-group', async ({ chatId }) => {
        socket.join(chatId);
        const roomMessages = await groupChatService.getMessagesFromChat(chatId, 1);
        io.to(chatId).emit("group-chat-messages", { message: roomMessages });
      });
  
      socket.on('leave-group', async ({ chatId }) => {
        socket.leave(chatId);
      });
  
      socket.on('group-message', async (data) => {
        await groupChatService.addMessage(data);
        const roomMessages = await groupChatService.getMessagesFromChat(data.groupId, 1);
        io.to(data.groupId).emit("group-chat-messages", { message: roomMessages });
      });













    })
}