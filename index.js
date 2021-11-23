const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://seoyeong:ksy-678411@cluster0.beecu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB Connected..'))
    .catch(err => console.log(err))


//model은 schema를 감싸주는 역할을 하고
//schema는 하나하나의 정보를 지정해 줄 수 있는 것을 의미


app.get('/', (req, res) => {
    res.send('Hello World!~~안녕하세요~')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})