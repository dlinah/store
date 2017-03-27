var express=require('express');
var fs=require("fs");
var bodyParser=require('body-parser');
var postMiddleware=bodyParser.urlencoded({extended:false});
var mongoose=require("mongoose");

var router=express.Router();

router.get("/",function(request,response){
  var list=[];
    mongoose.model("products").find({userid:request.session.userid},function(err,products){if(!err){
        list=products;
        response.render("products/list",{"list":products,"current":"products",loggedIn:request.session.loggedIn});
    }else{response.send(err);}
        })
})
router.get("/search",function(request,response){
    
  response.render("products/search",{"current":"search","post":false,loggedIn:request.session.loggedIn})
})
router.post("/search",postMiddleware,function(request,response){
    var id;
   var found; 
    mongoose.model("products").find({name:request.body.name},function(err,products){if(products.length!=0){
        response.render("products/search",{"current":"search","list":products,"post":true})
    }else{
        response.send("notfound");
    }
        })
})
router.get("/add",function(request,response){
  response.render("products/add",{"current":"add",loggedIn:request.session.loggedIn});
})
router.post("/add",postMiddleware,function(request,response){
    request.body.userid=request.session.userid;
      var productModel=mongoose.model("products");
    var product=new productModel(request.body);
    product.save(function(err){
        if(!err){
            response.redirect("/products");
        }else{
            response.send(err);
        }
    })

})



router.get("/del/:id",function(request,response){
    mongoose.model("products").remove({_id:request.params.id},function(err,removed){});
   
  response.redirect("/products")
})
router.get("/edit/:id",function(request,response){
  response.render("products/edit",{"current":"products","id":request.params.id,loggedIn:request.session.loggedIn})
})

router.post("/edit/:id",postMiddleware,function(request,response){
    
    
    mongoose.model("products").update({_id:request.params.id},{$set:request.body},function(err,pro){});
  response.redirect("/products")
})

module.exports=router;
