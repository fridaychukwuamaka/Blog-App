@@ -1,30 +0,0 @@
var mongoose = require("mongoose")

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    related: String,
    created: {type: Date, default: Date.now},
    author:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
           },
           email:String,
           username:String,
           accType:String

          },
  comments:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
       }

      ]
});



module.exports = mongoose.model("Blog", blogSchema);