/**
 * Created by flyTigger on 2019/8/1.
 */

//连接数据库
const mongose = require("mongoose")
mongose.connect("mongodb://localhost:27017/gzhipin_test2")
const conn = mongose.connection
conn.on('connected', () => {
    console.log("server connect success！！")
})

//创建一个Model
const userSchema = mongose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String},
})

const UserModel = mongose.model('user', userSchema)

//创建聊天
const chatSchema = mongose.Schema({
    from: {type: String, required: true},
    to: {type: String, required: true},
    chat_id: {type: String, required: true},
    content: {type: String, required: true},
    read: {type: Boolean, default: false},//是否已读
    create_time: {type: Number}
})

const ChatModel = mongose.model("chat", chatSchema)

exports.UserModel = UserModel
exports.ChatModel = ChatModel

