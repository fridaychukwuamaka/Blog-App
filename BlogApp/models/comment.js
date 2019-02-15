var mongoose=require("mongoose");


var CommentSchema = new mongoose.Schema({
    text:String,
        username:String,
        created:{type: Date, default: Date.now}

})

module.exports = mongoose.model("Comment", CommentSchema);