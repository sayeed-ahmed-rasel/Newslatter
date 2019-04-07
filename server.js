const express = require('express')
const mongoose = require("mongoose")
const request = require("request")
const async = require("async")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const expressHbs = require("express-handlebars")
const session = require("express-session")
const connectMongo = require("connect-mongo")(session)
const flash = require("express-flash")

const app = express()

//morgan
app.use(morgan('dev'));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'raselkey',
    resave: true,
    saveUninitialized: true,
    store: new connectMongo({
        url: 'mongodb://127.0.0.1:27017/newslatter'
    })
}))

// flash
app.use(flash())

//



// routes
app.route('/')
    .get((req, res) => {
        res.render('main/home', {
            message: req.flash('success')
        })
    })
    .post((req, res, next) => {

        request({
                url: 'https://us20.api.mailchimp.com/3.0/lists/cd026cccd7/members',
                method: 'POST',
                headers: {
                    'Authorization': 'randomUser 982200eccb1d3794832193c9cd6cf3db-us20',
                    'Content-Type': 'application/json'
                },
                json: {
                    'email_address': req.body.email,
                    'status': 'subscribed'
                }

            },
            function (err, response, body) {
                if (err) {
                    console.log(err);
                } else {
                    req.flash('success', ' you have successfully send your email.')
                    res.redirect('/');
                }
            }
        )



    })

app.use((req, res) => {
    res.render('404')
});










app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: ".hbs"
}));
app.set('view engine', 'hbs') // register the template engine
app.set('views', 'views') // specify the views directory



app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('App listening on port 3000!');
});