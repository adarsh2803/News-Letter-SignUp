//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});


app.post("/",function(req,res){
  var fn=req.body.fn;
  var ln= req.body.ln;
  var email=req.body.email;

  var data={
    members:[{
      email_address:email,
      status: "subscribed",
      merge_fields:{
        FNAME:fn,
        LNAME:ln,
      }
    }]
  };

  var jd=JSON.stringify(data);// this we will send to mailchimp servers
  const url="https://us19.api.mailchimp.com/3.0/lists/448cdb6afe";
  const options={
    method:"POST",
    auth:"ak28:c5b84f0515eeb0c73c54fd2f66f10821-us19",
  };

  const request=https.request(url,options,function(response){
      console.log(response.statusCode);
    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));

    });
  });
        request.write(jd);
        request.end();


});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT  || 3000,function(){
  console.log("server is running");
});




//mailchimp API key -> 00890621e291a3a2f101a70c11a06639-us19
//mailchimp unique id -> 448cdb6afe
