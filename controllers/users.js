var express=require("express");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var bcrypt=require("bcrypt");
var multer=require("multer");

var uploadFileMiddleware=multer({dest:__dirname+"/../public"
});

var postRequestMiddleware=bodyParser.urlencoded({extended:false});

var router=express.Router();
router.get("/logout",function(request,response){
    request.session.destroy();
  response.redirect("/users/login");
})
router.get("/login",function(request,response){
  response.render("users/login",{msg:request.flash("msg"),current:"login",loggedIn:request.session.loggedIn})
})

router.get("/register",function(request,response){
  response.render("users/register",{msg:request.flash("msg"),current:"register",loggedIn:request.session.loggedIn})
})

router.post("/login",postRequestMiddleware,function(request,response){
     mongoose.model("users").find({name:request.body.name},function(err,user){
         if(user.length!=0){
             if (!bcrypt.compareSync(request.body.password,user[0].password))
             {request.flash("msg","wrong password");
              request.session.loggedIn=flase;
              response.redirect("/users/login");}
             else{
                 request.session.loggedIn=true;
                 request.session.username=user[0].name;
                 request.session.userid=user[0]._id;
                response.redirect("/products");
             }
         }
         else{
                request.flash("msg","user not found");
             response.redirect("/users/login");
         }
     });    
});

router.post("/register",uploadFileMiddleware.single("avatar"),function(request,response){
  var UserModel=mongoose.model("users");
  var salt=bcrypt.genSaltSync();
    if(request.body.password==request.body.repassword){
          var hashedPassword=bcrypt.hashSync(request.body.password,salt);
          var user=new UserModel({name:request.body.name,password:hashedPassword,avatar:request.file.filename,email:request.body.email});
          user.save(function(err){
            if(!err){
              response.redirect("/products");
            }else{
              response.send("Error");
            }
          })
    }
    else{
        request.flash("msg","password don't match");
        response.redirect("/users/register");
    }

})

module.exports=router;
