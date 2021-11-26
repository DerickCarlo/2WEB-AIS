//dependencies
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const { off } = require('process');

//express app
const app = express();

//register view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views/'));

//static folder || loads all assets from public folder
app.use(express.static(__dirname + '/public'));

//initializing ports
const PORT = process.env.PORT || 5000
app.listen(PORT);

//fetch data from the request
app.use(bodyParser.urlencoded({extended: false}));

//webpage routes
app.get('/', function(req, res) {
    res.render('land');
});
app.get('/home', function(req, res) {
    res.render('home');
});
app.get('/journal', function(req, res) {
    res.render('journal-entry');
});
app.get('/trial-balance', function(req, res) {
    res.render('trial-balance');
});
app.get('/system-user', function(req, res) {
    res.render('sys-users');
});
app.get('/coa', function(req, res) {
    res.render('chart-of-accounts');
});
