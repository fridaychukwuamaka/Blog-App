var express= require("express");
var router = express.Router();
var Blog= require("../models/blogs");
var Comment= require("../models/comment");


router.get("/", function(req, res){
    res.redirect("/blogs");
});


module.exports=router;