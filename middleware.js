 const Listing = require("./models/listing");
 
 module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // store redirect
        req.flash("error", "You must be logged in to create Listings");
        return res.redirect("/login"); // return important
    }
    next();
};


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};



module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
   if (!listing.owner || listing.owner.toString() !== req.user._id.toString())
{
        req.flash("error", "You do not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

const Review = require("./models/reviews");

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (review.author.toString() !== req.user._id.toString()) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};


