var mongoose=require("mongoose");


var AccomCommentSchema = new mongoose.Schema({
    text:String,
        username:String,
        created:{type: Date, default: Date.now}

})

module.exports = mongoose.model("AccomComment", AccomCommentSchema);