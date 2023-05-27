const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const session = require('express-session');




//mongodbconnection
mongoose.connect(config.database, {
    useNewUrlParser: true,})
  .then(() => {
    console.log("Connected to database");
  }).catch((e) => console.log(e));



//On Connection
mongoose.connection.on('error', function(err){
    console.log(err);
});



const app=express();

const users=require('./routes/users');



//Cors
app.use(cors());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));


//Body Parser
app.use(bodyParser.json());


//Passport Middleware

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);







//PORT
const port=3000;


app.use('/users',users);


//index Route
app.get('/', function(req, res){
    res.send('Invalid Endpoint');
});


//Start Server
app.listen(port, function() {
    console.log("Sv started on port "+port)
});