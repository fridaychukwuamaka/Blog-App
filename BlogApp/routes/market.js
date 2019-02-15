var express= require("express");
var router = express.Router();
/* var Market= require("../models/market"); */



router.get("/market", function(req, res){
    res.render("market")
})

router.get("/media", function(req, res){
    res.render("media")
})


module.exports=router;