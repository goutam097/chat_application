
const messageService = require("./controllers/message.controller");

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
    })
}