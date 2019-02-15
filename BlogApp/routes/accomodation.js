var express= require("express");
var router = express.Router();
var Accomodation= require("../models/accomodation");
var Comment= require("../models/comment");



router.get("/accomodation",  function(req, res){
    Accomodation.find({}, function(err, accomodation){
        if(err){
            console.log(err)
        }else{
            res.render("accomodation", {accomodation:accomodation});
        }
    })

})


//ACCOM. COMMENT
router.post("/accomodation/:id/comment",isEnabled, function(req, res){
    var comment= req.params.id;
    Accomodation.findById(comment, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{ 
            var comment={
                text:req.body.comment,
                    username:req.body.username
            }
            AccomComment.create(comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    foundBlog.comments.push(comment);
                    foundBlog.save()
                    res.redirect("/accomodation/"+ foundBlog._id);
                    
                }
            })
            }
        })
    })    



router.get("/accomodation/new",isEnabled, function(req, res){

    res.render("newAccomodation");

})


//CREATE NEW ACCOMODATION
router.post("/accomodation",isEnabled, function(req, res){
    var name =req.body.accomodation.name;
    var location= req.body.accomodation.location;
    var image =req.body.accomodation.image;
    var image1 =req.body.accomodation.image1;
    var image2 =req.body.accomodation.image2;
    var image3 =req.body.accomodation.image3;
    var image4 =req.body.accomodation.image4;
    var image5 =req.body.accomodation.image5;
    var price= req.body.accomodation.price;
    var space= req.body.accomodation.space;
    var description =req.body.accomodation.description;
    var author ={
        id: req.user._id,
        username:req.user.username,
        accType:req.user.accType
    }

    var newAccomodation={
         name: name,
         location:location,
         image: image,
         image1: image1,
         image2: image2,
         image3: image3,
         image4: image4,
         image5: image5,
         price:price,
         space:space,
         description: description,
         author:author,
    }
        Accomodation.create(newAccomodation, function(err, created){
            if(err){
                console.log(err)
            }else{
                req.flash("success", "Successfully created a new accomodation");
                res.redirect("/accomodation");
            }
        })
})


//SHOW ACCOMODATION
router.get("/accomodation/:id", function(req, res){
    var accom=req.params.id;
    Accomodation.findById(accom).populate("comments").exec(function(err, found){
        if(err){
            console.log(err);
        }else{
            Accomodation.find({name:found.name}, function(err, search){
                if(err){
                    console.log(err)
                }else{
                    res.render("showAccomodation", {found:found, search:search})
                }
            })
        }
    })
})



//edit accomodation route
router.get("/accomodation/:id/edit", function(req, res) {
    Accomodation.findById(req.params.id, function(err, foundAccom){
        if(err){
            console.log(err);
        }else{
            res.render("accomodation/edit", {campground:foundAccom} );
        }
    } )
})

//update
router.put("/accomodation/:id",checkAccomPostOwnership, function (req, res) {
    Accomodation.findByIdAndUpdate(req.params.id, req.body.accom, function(err, updatedBlog){
        if(err){
         req.flash("error", "You are not authorize to do this");
            res.redirect("/accomodation");
        }else{
         req.flash("success", "Successfully updated this Blog post");
            res.redirect("/accomodation/"+req.params.id);
        }
    })
}); 

//destroy route
router.delete("/accomodation/:id",checkAccomPostOwnership, function (req, res) {
Accomodation.findByIdAndDelete(req.params.id,  function(err, updatedBlog){
    if(err){
        req.flash("error", "You are not authorize to do this");
        res.redirect("/accomodation");
    }else{
     req.flash("success", "Successfully deleted an Accomodation");
        res.redirect("/accomodation");
    }
})
}); 


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