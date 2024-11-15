const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./routes/user.route")
const messageRoutes = require("./routes/message.route")
const groupRoutes = require("./routes/group.route")
const path = require('path')


const app = express();
require("dotenv").config();

app.use(cors())
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/chat", messageRoutes)
app.use("/api/group", groupRoutes)

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('MongoDb Connected Successfully...!!!')
    const server = app.listen(process.env.PORT, () => {
        console.log(`Server Started on PORT ${process.env.PORT}`)
    })
    require("./socket")(server)
}).catch((err) => {
    console.log(err)
    console.log('MongoDb Not Connected Successfully...!!!')
})