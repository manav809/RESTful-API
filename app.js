const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs'); // ejs is initialized so that we could template html


app.use(bodyParser.urlencoded({extended: true}));//allows for parsing of the body

app.use(express.static("public"));// so we could use css

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false });

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);
/////////////////////////////Requests for ALL ARTICLES//////////////////////
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send(err);
    }
  });
})

.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added a new article");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req, res){
  Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all articles");
      }
      else{
        res.send(err);
      }
  });
});
////////////////////////////////////REQUESTS FOR A SPECIFIC ARTICLE////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }
    else{
      res.send("No artciles matching that title were found");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},//condition
    {title: req.body.title, content: req.body.content},//changes
    {overwrite: true},
    function(err, foundArticle){
      if(!err){
        res.send("Successfully updated the article");
      }
    }
  );
});
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},//condition
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully Updated the portion");
      }
      else{
        res.send(err);
      }
    }
  );
});

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("removed the chosen one");
      }
      else{
        res.send(err);
      }
    }
  );
});




app.get("/", function(req, res){//send hello when the user tries to access the home route
  res.send("Hello");
});



app.listen(3000, function(){// we want to start at 3000
  console.log("Server is running on port 3000");
});
// {
//     "_id": "60eda114160358bc5d2820de",
//     "title": "REST",
//     "content": "REST is short for REpresentational State Transfer. It's an architectural style of designing APIs"
// },
// {
//     "_id": "60eda255160358bc5d28210c",
//     "title": "Node",
//     "content": "Node is a backend framework that works through JS syntax and it allows for communication with the server."
// },
// {
//     "_id": "60eda255160358bc5d28210f",
//     "title": "Express",
//     "content": "Express is a node based framework that lets us with API functionality when it comes to building apps and websites."
// },
// {
//     "_id": "60eda2df160358bc5d282129",
//     "title": "React.js",
//     "content": "This is a JavaScript library that is used to build interative frontends for applications and things like that."
// },
// {
//     "_id": "60ee38c92e288e41105e7392",
//     "title": "Manav Patel",
//     "content": "JS DEVELOPER",
//     "__v": 0
// },
// {
//     "_id": "60ee39972e288e41105e7394",
//     "title": "Manav Patel",
//     "content": "JS DEVELOPER",
//     "__v": 0
// }
