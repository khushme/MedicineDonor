var express=require("express");
var path=require("path");
var bcrypt=require("bcrypt");
const mongoose = require('mongoose');
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);
app=express.Router();
app.use(express.urlencoded({ extended:true }));

// const dbConfig = "mongodb://localhost:27017/nov12020";
// const dbConfig="mongodb+srv://akuluser:akulpassword@clusterdata.jyig3.mongodb.net/nodedb";

const dbConfig="mongodb+srv://kush:kush@clusterdata.jv3lo.mongodb.net/MedicineDonor";
mongoose.connect(dbConfig).then(()=>{
    console.log("Connected");
}).catch((err)=>{
    console.log(err);
})

app.get("/",(req,resp)=>{
    resp.sendFile(path.join(__dirname,"..","public/new-user.html"));
})

//=----------
var UserSchemaObj=new mongoose.Schema({
        un : String,
        pwd : String,
        mobile: String,
        dos: {type:Date,default:Date.now }
});

var userModel=mongoose.model("donors",UserSchemaObj);


app.post("/savedonor",async (req,resp)=>{

    var salt=await bcrypt.genSalt();
    req.body.pwd= await bcrypt.hash(req.body.pwd,salt);

    await userModel.create(req.body,(err,result)=>{
        if(err)
        {
            resp.send(err);
            return;
        }
        resp.json(result);
        console.log(result);
    });
})


app.post("/logindonor",async (req,res)=>{


    // console.log("username------- "+req.body);
    userModel.findOne({un:req.body.un})
    .then(function(user) {
        console.log("user "+user);
    
        return bcrypt.compare(req.body.pwd, user.pwd);
    })
    .then(function(samePassword) {
        if(!samePassword) {
            res.status(403).send();
            res.json('{"success" : false, "status" : 403}');
        }
        // res.send(userfound);
        res.json('{"success" : true, "status" : 200}');
    })
    .catch(function(error){
        console.log("Error authenticating user: ");
        console.log(error);
        next();
    });
})

/*app.post("/save",(req,resp)=>{
    var user=new userModel(req.body);
    user.save(function(err,doc)
    {
        if(err)
            resp.send(err);
        else
        {
            resp.send("Saved "+doc);
            console.log("1. Saved "+doc)
        }
       
    });
})*/
  
app.post("/delete",(req,resp)=>{
    userModel.remove({uid:req.body.uid}).then((result)=>
    {
        console.log(result);
        if(result.deletedCount!=0)
        resp.json({msg:"Deleted"});
        else
        resp.json({msg:"Invalid Uid"});
    });
})
app.post("/update",(req,resp)=>{
    userModel.update({uid:req.body.uid},{$set:{pwd:req.body.pwd}}).then(function(result){
        resp.send(result);
        console.log(result);
    });
    //To change all the fields coming from client
    /*
    userModel.update({uid:req.body.uid},{$set:req.body}).then(function(result){
        resp.send(result);
        console.log(result);
    });
    */
})

app.post("/showall",(req,resp)=>{
    userModel.find()
    .then((result)=>{
        resp.json(result);
    })
    .catch((err)=>{
        resp.json({errmsg:err});
    })
})
app.post("/searchone",(req,resp)=>{
    userModel.find({uid:req.body.uid})
    .then((result)=>{
        console.log(result.length+" Records Found");
        console.log(result);
        resp.json(result);
    })
    .catch((err)=>{
        resp.json({errmsg:err});
    })
})


module.exports=app;
