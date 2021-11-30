const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,     //스페이스바를 없앰
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
    tokenExp: { //토큰사용기한
        type: Number
    }
})

//user 모델에 user 정보를 저장하기 전에 function을 줘서 무언가를 한다.
userSchema.pre('save', function (next) {
    //this는 위에 userSchema를 가리킨다
    var user = this;

    //password가 변환될때만 암호화 해줌
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                //next를 하고나면 user.save로 감
                next()
            })
        })
    } else {
        //next를 하고나면 user.save로 감
        next()
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567 암호화된 비밀번호 $2b$10$iWV7Xf9XWu/o8SlYl750lOH9bM7wrDT0mzdiP5D1wF0tpMBOKJ53.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)   //isMatch값에 true가 들어감
    })

}

userSchema.methods.generateToken = function (cb) {

    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    //user._id + 'secretToken' = token
    //secretToken을 넣었을때 user._id가 나옴

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //user._id + '' = token
    //토큰을 decode한다.
    jwt.verify(token, 'secretToken', function (err, decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

//userSchema의 이름을 User이라는 model로 만들어서 넣어줌
const User = mongoose.model('User', userSchema);

//모델을 다른 곳에서도 사용할 수 있도록 export를 해줌
module.exports = { User }