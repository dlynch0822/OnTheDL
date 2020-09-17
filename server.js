//server framework for Node.js
const express = require('express')
//object modeling tool for MongoDB
const mongoose = require('mongoose')
const Article = require('./models/review')
const reviewRouter = require('./routes/reviews')
//override to support beyond natively supported requests "GET" & "POST"
const methodOverride = require('method-override')
const app = express()

//establish MongoDB connection
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

//view engine converts ejs to html
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
//
app.use(methodOverride('_method'))


//setup route at index/main route
app.get('/', async (req, res) => {
    const reviews = await Article.find().sort({
    createdAt: 'desc' })
    res.render('reviews/index', { reviews: reviews})
})

app.use('/reviews', reviewRouter)

//set to port 5000
app.listen(5000)