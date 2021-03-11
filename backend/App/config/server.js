const express = require("express"), //IMPORTAÇÕES: EXPRESS, CORS, MYSQL
app = express(),
cors = require("cors"),
mysql = require("mysql");
bcrypt = require('bcrypt');
bodyParser = require('body-parser');
cookie = require('cookie-parser');
session = require('express-session');
jwt = require('jsonwebtoken')

const { response } = require("express");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT")
    res.setHeader("Acess-Control-Allow-Headers", "X-Requested-With, content-type,x-acess-token,Authorization,access-x-btc,elegibility,x-buy-token")
    res.setHeader("Access-Control-Allow-Credentials", true)
    return next()
});

app.use(cors());
app.use(cookie())

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json()); //Lê dados em json

//Session
app.use(session({
    key: 'userId',
    secret: 'conscire',
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: 60 * 60 * 24,
    },
}))


module.exports = app;