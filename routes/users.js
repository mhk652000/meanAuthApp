const express=require('express');
const router=express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
const User=require('../models/user');
const config= require('../config/database');
const session = require('express-session');

router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
  }));

router.use(passport.initialize());
router.use(passport.session());

//Register
router.post('/register', function(req,res,next){
    let newUser=new User({
        name:req.body.name,
        email:req.body.email,
        username: req.body.username,
        password:req.body.password
    });

    User.addUser(newUser,function(user){
        if(user){
            res.json({success:true, msg:'Registered'});
        } else{
            res.json({success:false, msg:'Failed to Register'});
        }
    });
});




//Authenticate
router.post('/authenticate', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, function(user, err) {
      if (err) {
        return next(err);
      }
  
      if (!user) {
        return res.json({ success: false, msg: 'User Not Found' });
      }
  
      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) {
          return next(err);
        }
  
        if (isMatch) {
          req.session.user = user; // Store user data in session
          const token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 604800 });
            res.json({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email
            }
          });
        } else {
          return res.json({ success: false, msg: 'Wrong Password' });
        }
      });
    });
  });



//Profile
router.get('/profile', passport.authenticate('jwt', {session:false}),function(req,res,next){
    res.json({user:req.user});
});

//Validate
router.get('/validate', function(req,res,next){
    res.send('Valid');
});

module.exports=router;