var express= require("express");
var router = express.Router();
var Blog= require("../models/blogs");
var Comment= require("../models/comment");
var Accomodation= require("../models/accomodation");


router.get("/blogs", function(req, res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err)
        }else{
            console.log(req.user);
            res.render("index", {blogs:allBlogs});
        }
    })
});


router.get("/blogs/new", isEnabled, function(req, res){

    res.render("new")
})


router.post("/blogs",isLoggedIn, function(req, res){
    var title =req.body.blog.title;
    var image =req.body.blog.image;
    var body =req.body.blog.body;
    var related= req.body.blog.related
    var author ={
        id: req.user._id,
        username:req.user.username,
        accType:req.user.accType
    }

    var newBlog={
         title: title,
         image: image,
         body: body,
         author:author,
         related:related
        }
    Blog.create(newBlog, function(err, newlyCreated){
       if(err){
           console.log(err);
       }else{
        req.flash("success", "Successfully created a Blog post")   
       res.redirect("/blogs");
       }
   });
   }); 
   
router.get("/blogs/:id", function(req, res){
    console.log(req.params.id)
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
        if(err){
            console.log(err)
                }else
                Blog.find({related:foundBlog.related}, function(err, found){
                    if(err){
                        console.log(err)
                    }else{
                       /*  console.log(found)
                        console.log(found.related)
                        console.log(found.title) */
                        res.render("show", {blog: foundBlog, found:found});
                    }
                })
            
            })
        }
)
   //edit campground route
   router.get("/blogs/:id/edit",checkBlogPostOwnership, function(req, res) {
           Campground.findById(req.params.id, function(err, foundCampground){
               if(err){
                   console.log(err);
               }else{
                   res.render("campgrounds/edit", {campground:foundCampground} );
               }
           } )
      })
   
   //update
   router.put("/blogs/:id",checkBlogPostOwnership, function (req, res) {
           Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
               if(err){
                req.flash("error", "You are not authorize to do this");
                   res.redirect("/blogs");
               }else{
                req.flash("success", "Successfully updated this Blog post");
                   res.redirect("/blogs/"+req.params.id);
               }
           })
   }); 
   
   //destroy route
   router.delete("/blogs/:id",checkBlogPostOwnership, function (req, res) {
       Blog.findByIdAndDelete(req.params.id,  function(err, updatedBlog){
           if(err){
               req.flash("error", "You are not authorize to do this");
               res.redirect("/blogs");
           }else{
            req.flash("success", "Successfully deleted a Blog post");
               res.redirect("/blogs");
           }
       })
   }); 

//COMMENT   
router.post("/blogs/:id/comment", function(req, res){
    var comment= req.params.id;
    Blog.findById(comment, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{ 
            var comment={
                text:req.body.comment,
                    username:req.body.username
            }
            Comment.create(comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    foundBlog.comments.push(comment);
                    foundBlog.save()
                    res.redirect("/blogs/"+ foundBlog._id);
                    
                }
            })
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