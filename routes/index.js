var express = require('express');
var router = express.Router();

const md5 = require("blueimp-md5")
const {UserModel}=require("../db/models")
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
    UserModel.findOne({username, password:md5(password)}, filter, function (err, user) {
        if (user) {//登录成功
            res.cookie("userId", user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
            res.send({code: 0, data: user})
        } else {//登录失败
            res.send({code: 1, msg: "账号或密码错误！"})
        }
    })
})

module.exports = router;
