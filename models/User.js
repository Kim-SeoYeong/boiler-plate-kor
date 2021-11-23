const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //스페이스바를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        //토큰 사용 기한
        type: Number
    }
})

//userSchema의 이름을 User이라는 model로 만들어서 넣어줌
const User = mongoose.model('User', userSchema);

//모델을 다른 곳에서도 사용할 수 있도록 export를 해줌
module.exports = { User }