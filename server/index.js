require('dotenv').config()
const express=require('express');
const app=express();
const models = require("./models/Collections.js");
const nodemailer = require('nodemailer');


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