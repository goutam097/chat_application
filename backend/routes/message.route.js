const {  createConversation, messagesForConversation, CreateNewMessages,   } = require("../controllers/message.controller");
// const uploadAudioFile = require("../middleware/fileUpload.middleware");


const router = require("express").Router();


router.get("/messagesForConversation/:conversationId",messagesForConversation)
// router.get("/getConversations/:userId",getConversations)
router.post("/createConversation",createConversation)
router.post("/CreateNewMessages",CreateNewMessages)
// router.post("/SendNewAudioFile",uploadAudioFile, SendNewAudioFile)
// router.get('/list',getUnSeenMessage);

module.exports = router;