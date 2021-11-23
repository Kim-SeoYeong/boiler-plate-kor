const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

//body-Parser는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 것
//application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져오게 하는 것
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 타입으로 된 것을 분석해서 가져올 수 있게 하는 것
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))


//model은 schema를 감싸주는 역할을 하고
//schema는 하나하나의 정보를 지정해 줄 수 있는 것을 의미


app.get('/', (req, res) => {
    res.send('Hello World!~~안녕하세요~')
})

app.post('/register', (req, res) => {
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})