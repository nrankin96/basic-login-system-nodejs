const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
});

connection.connect(function(err) {
    if (err) {
        console.log(err);
    }
    console.log("Connected!");
    connection.query('CREATE DATABASE nodelogin', (err, result) => {
        if (err){
            console.log(err);
        }
        console.log('Database created!');
    })
  });

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login'));
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        
    }
});