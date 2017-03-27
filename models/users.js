var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var users=new Schema({
  name:String,
  password:String,
  avatar:String,
  email:String
})
mongoose.model("users",users);
