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


const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/static'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));

});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if(err) {
                throw err
            };
            if(results.length >0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password');
            }
            res.end();
    });
} else {
    res.send('Please enter Username and Password.');
    res.end();
}
});

app.get('/home', (req, res) => {
    if(req.session.loggedin) {
        res.send('Welcome back ' + req.session.username + ' !');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});



app.listen(3000, (req, res) => {
    console.log('Servers started on port 3000');
});
    
