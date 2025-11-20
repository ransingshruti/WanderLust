const mongoose=require("mongoose");
const reviews = require("./reviews");

const listingSchema=new mongoose.Schema({
    img:{
        url:String,
        filename:String
    },
     title:{
        type:String
    },
     description:{
        type:String
    },
     price:{
        type:Number
    },
     location:{
        type:String
    },
     country:{
        type:String
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},
geometry:{
    type:{
        type:String,
        enum:['Point'],
        required:true
    },
    coordinates:{
    type:[Number],
    required:true
}
}
   
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}})
    }
})
module.exports=mongoose.model("Listing",listingSchema);