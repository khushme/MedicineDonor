var express= require("express");
var bodyparser=require("body-parser");
var path=require("path");
var cors=require("cors");//install ist
var mongoose=require("mongoose");


const port = process.env.PORT || 8082;
var app=express();
app.use(express.static("public"));

app.use(bodyparser.json());//for parsing POST data coming from Client
app.use(cors());//to accept request from react server
app.use(express.urlencoded({ extended:true }));

// app.get("/",(req,res)=>{
// let fulllenght=path.join(process.cwd(),"public","index.html");
// });


var routeUser=require("./routers/SignupRouter");
app.use("/api/react",routeUser);


if(process.env.NODE_ENV==='production')
{
    app.use(express.static(path.join(__dirname,"medicinedonor","build")));
    app.get("*",(req,resp)=>{
        resp.sendFile(path.join(__dirname,"medicinedonor","build","index.html"));
    })
}

app.listen(port,()=>{

    console.log("Service Started");
})
