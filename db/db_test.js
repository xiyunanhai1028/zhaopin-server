/**
 * Created by flyTigger on 2019/8/1.
 */

const md5=require("blueimp-md5")
//链接数据库
const mongoose = require("mongoose")
mongoose.connect('mongodb://localhost:27017/gzhipin_test2')
const conn = mongoose.connection
conn.on('connected', function () {
    console.log("数据库链接成功！！")
})

//得到对应待定集合的Model
//定义Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true,}
})
//定义model
const UserModel = mongoose.model('user', userSchema)//集合users

//CRUD操作
function testSave() {
    //user对象数据
    const user={
        username:"李四",
        password:md5("1234"),
        type:"laoban"
    }

    const userModel=new UserModel(user)

    userModel.save(function (err,user) {
        console.log("save",err,user)
    })
}

// testSave()

function testFind() {
    UserModel.find(function (err, users) {
        console.log("find",err,users)
    })

    UserModel.findOne({_id:"5d4298bf2865950e4860c203"},function (err,user) {
        console.log("findOne",err,user)
    })
}

// testFind()

function testUpdate() {
    UserModel.findByIdAndUpdate({_id:"5d4298bf2865950e4860c203"},{username:"李思远"},function (err, oldUser) {
        console.log("findByIdAndUpdate",err,oldUser)
    })
}

// testUpdate()


function testRemove() {
    UserModel.remove({_id:"5d4298bf2865950e4860c203"},function (err, doc) {
        console.log("remove",err,doc)
    })
}

testRemove()