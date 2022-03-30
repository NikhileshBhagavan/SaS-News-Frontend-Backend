require('dotenv').config()
const express=require('express');
const app=express();
const models = require("./models/Collections.js");
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const md5=require("md5");
const jsonParser = bodyParser.json()


function generateOTP() {

    // Declare a digits variable 
    // which stores all digits
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

app.listen(3000, () => {
    console.log("listening to port 3000");
});
app.get('/preregistercheck/:username/:email',function(req,res){
    const username=req.params['username'];
    const email=req.params['email'];
    models.User.find({username:username},function(err,docs){
        console.log(docs);
        if(err){
            res.send({message:"Something went wrong ... Try Again"});
        }
        else{
            if(docs.length>0){
                res.send({message:"Username already taken"});
            }
            else{
                models.User.find({email:email},function(error,doc){
                    if(error){
                        res.send({message:"Something went wrong ... Try Again"});
                    }
                    else{
                        if(doc.length>0){
                            res.send({message:"Email already registered"});
                        }
                        else{
                            res.send({message:"Success"});
                        }
                    }
                });
            }
        }
    });

    return ;
});

app.get("/generateemailconfirmationcode/:email",function(req,res){
    const email=req.params['email'];
    let a = generateOTP();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    var mailOptions = {
        from: process.env.EMAIL,
        to: "" + email,
        subject: 'Email Confirmation Code for Registration Of SaS News 📰' ,
        text: "Confirmation Code is" + " " + a
    };
    transporter.sendMail(mailOptions, function(error, info) {

        if(error){
            res.send({is_success:false,message:"Something went wrong ... Click Resend Code Again"});

        }
        else{
            res.send({is_success:true,message:a});
        }

    });

});

app.post("/registeruser",jsonParser,function(req,res){
    console.log(req.body);
    let user=new models.User({
        username:req.body.username,
        password:md5(req.body.password),
        email:req.body.email,
    });
    user.save(function(err){
        if(err){
            res.send({message:"Something went wrong"});
        }
        else{
            res.send({message:"success"});
        }
    })
   
});

app.post("/find_user",jsonParser,function(req,res){
    console.log("hi");
    models.User.findOne({username:req.body.username,password:md5(req.body.password)},function(err,doc){
        if(err){
            console.log("Inside error");
            res.send({message:"error"});
        }
        else{
            if(doc===null){
                console.log("Inside notfound");
                res.send({message:"notfound"});
            }
            else{
                console.log("Inside found");
                res.send({message:"found"});
            }
        }
    })
});


app.get("/sendotp/:email",function(req,res){
    console.log("hi");
    const email=req.params['email'];
    let a = generateOTP();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    var mailOptions = {
        from: process.env.EMAIL,
        to: "" + email,
        subject: 'SaS News 📰 ... OTP TO CHANGE PASSWORD' ,
        text: "OTP to Change Password is" + " " + a
    };
    transporter.sendMail(mailOptions, function(error, info) {

        if(error){
            res.send({is_success:false,message:"Something went wrong ... Click Resend Code Again"});

        }
        else{
            res.send({is_success:true,message:a});
        }

    });
   
});
app.post("/find_user_for_pwch",jsonParser,function(req,res){
    console.log("Inside check if user exists");
    models.User.findOne({username:req.body.username},function(err,doc){
        if(err){
            res.send({message:"error",email:null});
        }
        else{
            if(doc===null){
                  res.send({message:"notfound",email:null});
               
            }
            else{
                res.send({message:"found",email:doc.email});
            }
        }

    });

});

app.post("/changepassword",jsonParser,function(req,res){
    console.log("Change Password");
    models.User.findOne({username:req.body.username},function(err,doc){
        if(err){
            res.send({message:"error"});
        }
        else{
            console.log(req.body.password);
            doc.password=md5(req.body.password);
            doc.save(function(error){
                if(error){
                    res.send({message:"error"});
                }
                else{
                    res.send({message:"success"});
                }
            });
        }
    });
});