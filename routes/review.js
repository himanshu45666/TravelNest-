const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) =>{
  let {error} = reviewSchema.validate(req.body);//jo bhi schema ke ander conditions hmne define kiye hai
  // kya req.body un saare conditions ko satisfied kar rhi hai yaa un conditions ke basis pe validate ho rhi hai
  if(error){//result ke ander error
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};
//Reviews
// Post Review Route
router.post("/", validateReview, wrapAsync(async(req, res) => {
  let listing = await Listing.findById(req.params.id);
  let  newReview = new Review(req.body.review);
// har listing ke pass reviews array bhi hoga 
listing.reviews.push(newReview);

 await newReview.save();
 await listing.save();
req.flash("success", "New Review Created!")
res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
let {id, reviewId} = req.params; // review Id ko access karna
await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // pull
await Review.findByIdAndDelete(reviewId); //jaise hi await kiya aur findById and delete ko call kiya waise hi hmara review delete ho jaayega
req.flash("success", "Review Deleted!")
res.redirect(`/listings/${id}`); // redirect karenge wapas se mere show page pe
}))

module.exports = router;