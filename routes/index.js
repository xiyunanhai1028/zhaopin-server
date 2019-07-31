var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post("/register", function (req, res) {
    const {username, password}=req.body
    if (username === "admin") {
        res.send({code: 1, msg: "此用户已注册",data:null})
    } else {
        res.send({code: 0, msg: "注册成功", data: {username, password, id: "123"}})
    }
})

module.exports = router;
