const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: true}); 

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
// create application/json parser
app.use(bodyParser.json());


app.get('/home', (req, res) => {
    if(req.session.loggedin) {
        res.send('Welcome back ' + req.session.username + ' !');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});


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

app.post('/register', urlencodedParser, (req, res) => {
   
    const registerUser = () => {
        let username = req.body.username;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let email = req.body.email;

        if(username.length < 50) {
            alert('Username must not exceede 50 characters.');
        } else if(password.length < 255) {
            alert('Password must not exceed 8 characters');
            if(confirmPassword != password){
                alert('Passwords do not match.');
            }
        } else {
            connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
                if(err) throw err;
                            // connection.query(`INSERT INTO accounts (username, password, email) VALUES(${username}, ${password}, ${email})`, function (err, result, fields) {
                
            });
        }
    } 





    res.send('Successfuly registered');

   
});




app.listen(3000, (req, res) => {
    console.log('Servers started on port 3000');
});
    
