var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var products=new Schema({
  name:String,
  desc:String,
  price:String,
  categ:String,
  img:String,
    userid:String
})
mongoose.model("products",products);
