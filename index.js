const express = require("express");
const path = require("path"); //path to HMTL pages, ref: pg34
const app = new express();
//Install mongoose and MongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

//Templating with EJS engine
const ejs = require("ejs");
app.set("view engine", "ejs");

//Static public folder
app.use(express.static("public"));

//Saving posts to database
const BlogPost = require("./models/BlogPost.js");
//Body Parser, ref: pg.57
const bodyParser = require("body-parser");
const { get } = require("browser-sync");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Page paths or routes, ref: pg.34
//refactor to res.render that looks for a views folder ref: pg. 38
//Refectored app.get index -> Display a list of blog posts ref: pg.60
app.get('/', async (req, res) => {
    const blogposts = await BlogPost.find( {} );
    res.render('index',{
        blogposts: blogposts
    });
})

app.get("/about", (req, res) => {
    res.render("about");
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
//Refector to get single blog posts page ref: pg. 65
app.get("/post/:id", async (req, res) => {
    const singlePost = await BlogPost.findById(req.params.id)
    res.render("post", {
        singlePost: singlePost
    });
});
//create post route ref: pg.53
app.get("/post/create", (req, res) => {
    res.render("create");
});

//Post Store handling and route
//Need a body-parser module, ref: pg.57
//Model and create method creates a new doc with the browser data
app.post("/posts/store", async (req, res) => {
    //console.log(req.body)
    await BlogPost.create(req.body, (error, blogpost) => {
        res.redirect("/");
    });
});

app.listen(4000, () => {
    console.log("App listening on port 4000");
});
