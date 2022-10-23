const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
});


const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/static'));
// support parsing of application/json type post data
app.use(bodyParser.json());
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: true });



app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
});


let username = req.body.username;
console.log(username);

function registerUser () {
    let username = req.body.username;
    let password = req.body.username;
    let confirmPassword = req.body.confirmPassword
    let email = req.body.email;
    
    if(username.length < 6) {
        alert('**Username must be at least 6 characters');
        
    }
}

module.exports = registerUser;