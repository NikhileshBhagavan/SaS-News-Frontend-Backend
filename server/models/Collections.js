const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');


mongoose.connect("mongodb://localhost:27017/NewsDB");
const userschema = new mongoose.Schema({
    username: String,
    password: String,
    email:String,

});


//userschema.plugin(passportlocalmongoose); //automatically do hash+salt our passwords

const usermodel = mongoose.model("user", userschema);

//passport.use(usermodel.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    usermodel.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = {
    User: usermodel,
    
}