const Listing=require("../models/listing");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index= (async(req,res)=>{
   const listings=await Listing.find();
  res.render("./listings/allListings",{listings})
})
module.exports.renderNewForm=(req,res)=>{
     res.render("./listings/new")
}


module.exports.index = async (req, res) => {
  const listings = await Listing.find();
  res.render("./listings/allListings", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new");
};

// module.exports.createListing = async (req, res, next) => {

// //  let response=await geocodingClient.forwardGeocode({
// //   query: req.body.listing.location,
// //   limit: 1
// // })
// //   .send();
  
 

// //   let url=req.file.path;
// //  let filename = req.file.filename;   
// //   // console.log(url,filename)
// //   const newListing=new Listing (req.body.listing);
// //   newListing.geometry=response.body.features[0].geometry
// //   newListing.owner=req.user._id;
// //   newListing.image={url,filename}
// //   let savedListing=await newListing.save();
// //   console.log(savedListing)
// //   req.flash("success","New Listing created");
// //   res.redirect("/listings")

// module.exports.createListing = async (req, res, next) => {

//   let response = await geocodingClient
//     .forwardGeocode({
//       query: req.body.listing.location,
//       limit: 1
//     })
//     .send();

//   // 🛑 If Mapbox returns ZERO results
//   if (!response.body.features || response.body.features.length === 0) {
//     req.flash("error", "Invalid Location. Please enter a valid city or place!");
//     return res.redirect("/listings/new");
//   }

//   let url = req.file.path;
//   let filename = req.file.filename;

//   const newListing = new Listing(req.body.listing);

//   // 🟢 Geometry is now safe
//   newListing.geometry = response.body.features[0].geometry;

//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };

//   let savedListing = await newListing.save();

//   req.flash("success", "New Listing created");
//   res.redirect("/listings");
// };

// };

module.exports.createListing = async (req, res, next) => {

  req.body.listing.location = req.body.listing.location.trim();

  const geoResponse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()
    .catch((err) => {
      console.log("MAPBOX ERROR:", err.message);
      return null;
    });

  if (!geoResponse || !geoResponse.body.features.length) {
    req.flash("error", "Invalid location! Try again.");
    return res.redirect("/listings/new");
  }

  const geoData = geoResponse.body.features[0].geometry;

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.geometry = geoData;
  newListing.owner = req.user._id;
  newListing.img= { url, filename };

  await newListing.save();

  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};




module.exports.showListings=module.exports.showListings = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        model: "User"
      }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listings");
  }

  res.render("show", { listing });
};

module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit",{listing})
};

module.exports.updateListings=(async(req,res)=>{
     const {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Edited")
    res.redirect(`/listings/${id}`)
});

module.exports.destroyListings=(async(req,res)=>{
    const {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted")
    res.redirect(`/listings`)
})