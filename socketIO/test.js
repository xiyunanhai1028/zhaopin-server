/**
 * Created by flyTigger on 2019/8/6.
 */
const {ChatModel} =require("../db/models")
module.exports = function (server) {
    //获取IO对象
    const io = require("socket.io")(server)

    //监视链接
    io.on('connection', function (socket) {
        console.log("有一个客户端链接~~")
        //接收客户端发来的消息
        socket.on("sendMsg", function ({from, to, content}) {
            console.log("客户端发来的消息：" + {from, to, content})
            const chat_id = [from, to].sort().join("_")
            const create_time = Date.now()
            new ChatModel({from, to, content, chat_id, create_time}).save(function (err, val) {
                //回复客户端
                io.emit("receiveMsg", val)
            })
        })
    })
}