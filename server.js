const express = require('express')
const app = express()

//view engine converts ejs to html
app.set('view engine', 'ejs')


//setup route at index/main route
app.get('/', (req, res) => {
    res.render('index')
})

//set to port 5000
app.listen(5000)