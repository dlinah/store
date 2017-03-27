var express=require('express');
var server=express();
var fs=require("fs");
var bcrypt=require("bcrypt");
var mongoose=require("mongoose");
var productRouter=require("./controllers/product");
var userRouter=require("./controllers/users");

var session=require("express-session");
var flash=require("connect-flash");


var sessionMiddleware=session({secret:"#@$@#%$^&",resave:'',saveUninitialized:''});
server.use(sessionMiddleware);

server.use(function(request,response,next){
  var loggedIn=request.session.loggedIn;
  var username=request.session.username;
  var userid=request.session.userid;

  response.locals={loggedIn:loggedIn,username:username,userid:userid}
  next();
})

server.use(flash());

mongoose.connect("mongodb://localhost:27017/node_lab");

fs.readdirSync(__dirname+"/models").forEach(function(file){
  require("./models/"+file);
})

server.use(express.static('public'));
server.use("/products",productRouter);
server.use("/users",userRouter);


server.set("view engine","ejs");
server.set("views","./views");
server.listen(8090);
