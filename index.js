const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const getRouter = require('./routes/get-routes')

const app = express()

// database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log('Connected to nauli database'))
.catch((err)=> {
    console.log(err)
})

// MIDDLEWARES
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.set('trust proxy', true) //our app is hosted on server using proxy to pass user request
app.use(getRouter)


app.listen(process.env.PORT || 3000, ()=> console.log('Running on port 3000'))

process.on('unhandledRejection', (reason, promise) => {
    console.log(reason)
    //on production here process will change from crash to start cools
})

//caught any exception
process.on('uncaughtException', (err) => {
    console.log(err)
})