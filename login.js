const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const alert = require('alert');
const ejs = require('ejs');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodelogin'
});


connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    connection.query('SELECT * FROM accounts', (err, result) => {
        if (err) throw err;
        // console.log(result);
    })
  });


const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: true}); 

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/static', express.static(__dirname + '/static'));
// create application/json parser
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));

});

app.get('/home', (req, res) => {

    if(req.session.loggedin) {
        res.redirect('dashboard');
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
});

app.get('/dashboard', (req, res) => {
    if(req.session.loggedin) {
        let username = req.session.username;
        let email = connection.query('SELECT email FROM accounts WHERE username = ?', [username], (err, results) => {
            if (err) throw err;
           Object.keys(results).forEach((key) => {
            let row = results[key];
            email = row.email;
            res.render('dashboard', 
                 {Username: username, email: email});
           });
            
        });   
    } else {
        res.send('Please login to view this page!');
    }
    

});



app.post('/register', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let confirmPW = req.body.confirmPassword;
    let email = req.body.email; 

    if(confirmPW != password) {
        alert('Passwords do not match!');
    }else {
        connection.query(`INSERT INTO accounts (username, password, email) VALUES ('${username}', '${password}', '${email}')`, (err, results) => {
            if (err){
                console.log(err);
            }
            console.log('New user inserted');
        });
        res.redirect('/');
    };
    
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;
            
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


app.listen(3000, (req, res) => {
    console.log('Servers started on port 3000');
});
    
