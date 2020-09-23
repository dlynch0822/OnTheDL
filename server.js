if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//server framework for Node.js
const express = require('express')
//object modeling tool for MongoDB
const mongoose = require('mongoose')
const Article = require('./models/review')
const reviewRouter = require('./routes/reviews')
//override to support beyond natively supported requests "GET" & "POST"
const methodOverride = require('method-override')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

//establish MongoDB connection
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

//view engine converts ejs to html
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//setup route at index/main route
app.get('/', checkAuthenticated, async (req, res) => {
    const reviews = await Article.find().sort({
    createdAt: 'desc' })
    res.render('reviews/index', { reviews: reviews})
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 5)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword
        })
        res.redirect('/login')
    }
    catch {
    res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}


app.use('/reviews', reviewRouter)

//set to port 3000
app.listen(3000)