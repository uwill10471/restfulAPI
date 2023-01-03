const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose =require("mongoose");

const app = express();
app.set("view engine" , "ejs");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb" ,{
      useNewUrlParser: true,
        useUnifiedTopology: true,
      //  useCreateIndex: true, 
})

const articleSchema = {
    title: String ,
    contents:String
}

const Articles = mongoose.model("Articles" , articleSchema);



app.route("/articles")


.get(function(req,res){
    Articles.find(function(err, foundArticles){
        if(!err){
        res.send(foundArticles);}
        else{
            res.send(err);
        }

    })
})

.post(function(req,res){


   const newArticle = new Articles({
    title: req.body.title,
    contents: req.body.contents
   });
   newArticle.save(function(err){
    if(!err){
        res.send("successfully added a new article");
    }else{
        res.send(err);
    }
   });
})

.delete( function(req,res){
    Articles.deleteMany(function(err){
        if(!err){
          res.send("successfully deleted all articles")  
        }else{
            res.send(err);
        }
    })
})
     
app.route("/articles/:articletitle")

.get(function(req,res){
  
Articles.findOne({title:   req.params.articletitle}, function(err, foundArticle){
    if(foundArticle){
        res.send(foundArticle);
    }else{
        res.send("no articles matching that title was found.");
    }
});
})

.put(function(req,res){
    Articles.replaceOne(
        {title:req.params.articletitle},
        {title: req.body.title, contents:req.body.contents},
        {overwrite:true},
        function(err,updatearticle){
            if(!err){
                res.send("updated successfully")
            }else{
                res.send(err);
            }
        }
    )
})
  
.patch(function(req,res){
    Articles.updateOne(
        {title:req.params.articletitle},
       {$set: req.body},
        function(err,updatedarticle){
         if(!err){
            res.send("successfull updating")
         }else{
            res.send(err)
         }   
        }
        )
})

.delete(function(req,res){
    Articles.deleteOne(
        {title:req.params.articletitle},
        function(err){
            if(!err){
                res.send("deleted suucessfully")
            }else{
                res.send(err)
            }
        }
    )
});
app.listen(3000 ,function(req,res){
    console.log("server started at port 3000");
})
