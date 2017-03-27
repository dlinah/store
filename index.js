var fs=require("fs");
var url= require("url");
var qs=require("querystring");

var container={};
container.init=function(response,request){
    container.response=response;
    container.request=request;
    container.parts=url.parse(request.url);
    container.pathname=container.parts.pathname;
    console.log(container.pathname);
}
container.route = function(){
    fs.readFile(__dirname+container.pathname,function(err,data){
      if(!err){
        container.response.setHeader("Content-Type","text/html");
        container.response.writeHead(200);
          if (container.pathname =="/home.html"){
              var list=fs.readFileSync(__dirname+"/products.db").toString();
              container.response.write(data.toString()+list+"</body></html>");

          }
          else if(container.pathname=="/search.html"){
            var list=JSON.parse(fs.readFileSync(__dirname+"/products.db").toString());
             var search = qs.parse(container.parts.query);
              console.log(JSON.stringify(search));
              var p;
              for(i=0;i<list.length;i++){
                  list[i].id==search.id?p=JSON.stringify(list[i]):p=0;
              }
            container.response.write(data.toString()+(p?p:"")+"</div> </div> </body></html>");
          }
          else{ container.response.write(data.toString());}
      }else{
        container.response.writeHead(404);
        container.response.write("not found!");
      }
      container.response.end();
    })}
container.add=function(){
    var requestBody='';
    console.log("post index");
    container.request.on("readable",function(){
      while(null !== (chunk=container.request.read())){
          requestBody+=chunk.toString();
      }
    })
    
    container.request.on("end",function(){
      var product=qs.parse(requestBody);
      var productsData=fs.readFileSync(__dirname+"/products.db").toString();
      var products=JSON.parse(productsData);
      var found;
        if(product.type=="add"){
              delete product.type;
              products.push(product);}
        else {
             delete product.type;
             for(i=0;i<products.length;i++){
                  if(products[i].id==product.id){
                      products[i]=product;found=true;break;
                  }
                 else found=false;
              }
            if(!found){
                container.response.write("product not found");
                container.response.end();
            }
        }
            fs.writeFileSync(__dirname+"/products.db",JSON.stringify(products));

    })

    container.pathname="/home.html";
    container.route();
}








module.exports=container
