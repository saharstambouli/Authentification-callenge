const express = require('express')
require ('dotenv').config()
const connectToMongo = require('./helpers/db.connect')
const app = express()

const port = process.env.PORT || 8000

app.use(express.json())
app.use('/user',require('./routes/user.routes'))



app.listen(port,(err)=>{
    err? console.log('err', err) : console.log(`Server is running on port : ${port}`)
})
connectToMongo()
