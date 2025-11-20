const Listing=require("../models/listing");
const Review=require("../models/reviews")

module.exports.createReview=(async(req,res)=>{
    const {id}=req.params;
    //   console.log(req.body.review);
    const listing=  await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview)
   listing.reviews.push(newReview._id);
    await newReview.save();
    // await listing.save();
     await listing.save({ validateModifiedOnly: true });
    
    console.log("new review saved");
    req.flash("success","New Review Created")
    res.redirect(`/listings/${listing._id}`)
});

module.exports.destroyReview=(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted")
    res.redirect(`/listings/${id}`);

})