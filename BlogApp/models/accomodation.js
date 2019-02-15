var mongoose=require("mongoose");


var AccomodationSchema = new mongoose.Schema({
        name:String,
        location:String,
        image1:String,
        image2:String,
        image3:String,
        image4:String,
        image5:String,
        price:String,
        space:String,
        description:String,
        created:{type: Date, default: Date.now},
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
              ref: "AccomComment"
            }
            
                ]

})

module.exports = mongoose.model("Accomodation", AccomodationSchema);