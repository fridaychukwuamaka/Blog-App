var express= require("express");
var router = express.Router();
var Book= require("../models/book");
var Blog= require("../models/blogs");
var Comment= require("../models/comment");

//BOOK ROUTES
router.get("/book", function(req, res){

    Book.find({}, function(err, book){
        if(err){
            console.log(err)
        }else{
            res.render("book", {book:book})
        }
    })

})

router.get("/book/new", function(req,res){
    res.render("newbook")

})

router.post("/book", function(req,res){
    var book= req.body.book;
    Book.create(book, function(err, created){
        if(err){
            console.log(err)
        }else{
            res.redirect("/book")
        }
    })
})



function isEnabled(req, res, next){
    if(req.isAuthenticated()){
                if( req.user.accType==="admin"){
                    return next();
                }
                else{
                    res.redirect("back")
                }
            }else{
                res.redirect("/blogs")
            }
        }
            
   

   
   function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
}
req.flash("error", "Please Login First!")
    res.redirect("/blogs")
}

function checkProfileOwnership(req, res ,next){
    if(req.isAuthenticated()){
        Blog.find().where("author.id").equals(req.user._id).exec(function(err, blogs){
            return next()
        })
             }else{
                res.redirect("back")
            }
    }



function checkBlogPostOwnership(req, res ,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("back")
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                   return next()
            }else{
                res.redirect("back")
            }
        }
        });
    }else{
        res.redirect("back")
    }
}

function checkAccomPostOwnership(req, res ,next){
    if(req.isAuthenticated()){
       Accomodation.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("back")
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                   return next()
            }else{
                res.redirect("back")
            }
        }
        });
    }else{
        res.redirect("back")
    }
}

module.exports=router;
