const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

//body-Parser는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 것
//application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져오게 하는 것
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 타입으로 된 것을 분석해서 가져올 수 있게 하는 것
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))


//model은 schema를 감싸주는 역할을 하고
//schema는 하나하나의 정보를 지정해 줄 수 있는 것을 의미


app.get('/', (req, res) => {
    res.send('Hello World!~~안녕하세요~')
})

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요~")
})

app.post('/api/users/register', (req, res) => {
    //회원가입 할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    //req.body 안에는 json 형식으로 
    //{
    //     id: dddd,
    //     pw : wwwww
    //} 들어있다.
    const user = new User(req.body)
    //정보들이 user 모델에 저장이 되고 function이 옴
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)    //비밀번호가 틀리면
                return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

            //비밀번호까지 맞다면 Token을 생성하기
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                //토큰을 저장한다. 어디에?  쿠키에 저장할 수도 있고, 로컬스토리지에 저장할 수도 있음
                //일단은 쿠키에다가 저장한다 (쿠키에 저장하려면 cookie-parser 라이브러리 설치해야함)
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            })
        })

    })
})

//auth는 미들웨어 역할을 함. get으로 가져온 후 콜백함수를 타기 전에 중간에 작업을 해주는 역할
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 이야기는 Authentication이 True 라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })

})

app.get('/api/users/logout', auth, (req, res) => {
    //auth 미들웨어에서 user._id를 가져와서 찾음
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" }
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})