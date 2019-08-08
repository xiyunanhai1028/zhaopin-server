var express = require('express');
var router = express.Router();

const md5 = require("blueimp-md5")
const {UserModel, ChatModel}=require("../db/models")
const filter = {password: 0, __v: 0}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// router.post("/register", function (req, res) {
//     const {username, password}=req.body
//     if (username === "admin") {
//         res.send({code: 1, msg: "此用户已注册", data: null})
//     } else {
//         res.send({code: 0, msg: "注册成功", data: {username, password, id: "123"}})
//     }
// })

//注册
router.post("/register", function (req, res) {
    const {username, password, type}=req.body
    //查询数据库是否已经存在该用户
    UserModel.findOne({username}, function (err, user) {
        if (user) {//用户已存在
            res.send({code: 1, msg: "用户已存在"})
        } else {
            new UserModel({username, type, password: md5(password)}).save(function (err, user) {
                console.log(user)
                res.cookie("userId", user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
                const data = {username, type, _id: user._id}
                res.send({code: 0, data})
            })
        }
    })
})

//登录
router.post("/login", function (req, res) {
    const {username, password}=req.body
    UserModel.findOne({username, password: md5(password)}, filter, function (err, user) {
        if (user) {//登录成功
            res.cookie("userId", user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
            res.send({code: 0, data: user})
        } else {//登录失败
            res.send({code: 1, msg: "账号或密码错误！"})
        }
    })
})

//更新用户信息
router.post("/updateInfo", function (req, res) {
    //获取userId
    let userId = req.cookies.userId
    if (!userId) {//userId不存在
        return res.send({code: 1, msg: "请先登录"})
    }
    //需要更新的数
    let user = req.body
    //更新数据
    UserModel.findByIdAndUpdate({_id: userId}, user, function (err, oldValue) {
        if (!oldValue) {//oldValue不存在
            //移除久的cook
            res.clearCookie("userId")
            res.send({code: 1, msg: "请先登录"})
        } else {
            //更新数据完成
            const {_id, username, type}=oldValue
            const data = Object.assign({_id, username, type}, user)
            res.send({code: 0, data})
        }
    })

})

//获取用户信息
router.get("/user", function (req, res) {
    const userId = req.cookies.userId
    if (!userId) {
        return res.send({code: 1, msg: "请先登录"})
    }
    UserModel.findOne({_id: userId}, filter, function (err, user) {
        if (user) {//获取成功
            res.send({code: 0, data: user})
        } else {//获取失败
            res.send({code: 1, msg: "请先登录"})
        }
    })
})

//获取用户列表
router.get("/userList", function (req, res) {
    const {type}=req.query
    UserModel.find({type}, filter, function (err, users) {
        res.send({code: 0, data: users})
    })
})

//获取聊天列表
router.get("/chatList", function (req, res) {
    const userId = req.cookies.userId
    //查询所有的聊天用户
    UserModel.find(function (err, userDocs) {
        const users = userDocs.reduce((users, user) => {
            users[user._id] = {
                username: user.username,
                header: user.header
            }
            return users
        }, {})

        //查询相关聊天信息
        ChatModel.find({"$or": [{from: userId}, {to: userId}]}, filter, function (err, chatMsgs) {
            res.send({code: 0, data: {users, chatMsgs}})
        })
    })

})

//修改指定消息为已读
router.post("/readmsg", function (req, res) {
    const from = req.body.from
    const to = req.cookies.userId
    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
        console.log('/readmsg', doc)
        res.send({code: 0, data: doc.nModified}) // 更新的数量
    })
})

module.exports = router;
