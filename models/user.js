const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const config= require('../config/database');


//User Schema
const UserSchema= new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,    
        required: true
    },
    username: {
        type: String,    
        required: true
    },
    password: {
        type: String,    
        required: true
    }
});


const User=module.exports=mongoose.model('User', UserSchema);


module.exports.getUserById = function(id, callback){
    User.findById(id).then(callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = { username: username };
    User.findOne(query).then(callback);
}


module.exports.addUser=function(newUser, callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(newUser.password,salt,function(err,hash){
            if(err) throw err;
            newUser.password=hash;
            newUser.save().then(callback);
        });
    });
}


module.exports.comparePassword=function(candidatePassword,hash, callback){
    bcrypt.compare(candidatePassword,hash, function (err, isMatch){
        if(isMatch){
            callback(null,isMatch);
        }
        if(err) throw err;
    });
}