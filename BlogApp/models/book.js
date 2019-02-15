var mongoose = require("mongoose")

var bookSchema = new mongoose.Schema({
    title: String,
    cover: String,
    size: String,
    type: String,
    book:String,
    maker:String,
    created: {type: Date, default: Date.now},
    author:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
           },
           email:String,
           username:String,
           accType:String

          }
});



module.exports = mongoose.model("Book", bookSchema);