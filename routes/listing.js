const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");//.. mtlb hm parent directory ke ander jaa rhe hai
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
//listing wale jitne bhi routes hai ye kai saare middleware ko use kar rhe hai

const validateListing = (req, res, next) =>{
  let {error} = listingSchema.validate(req.body);//jo bhi schema ke ander conditions hmne define kiye hai
  // kya req.body un saare conditions ko satisfied kar rhi hai yaa un conditions ke basis pe validate ho rhi hai
  if(error){//result ke ander error
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
};

//Index Route
router.get("/", wrapAsync(async (req, res) => {
 const allListings = await Listing.find({}); // await karle jo bhi result aayega usse alllistings variable me store kar lenge
 res.render("listings/index.ejs",{allListings});
}));
// Get request ke liye route create karna hai
// New Route
router.get("/new",(req,res) => {
  res.render("listings/new.ejs");
 // hm res me render apna ek new form uske liye view/listings ke ander new.ejs create 
});

//Show Route
router.get("/:id",  wrapAsync(async (req, res)=> {
    let {id} = req.params; //es id ko exact karte hai
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!")
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Get request ke liye route create karna hai
//Create Route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
  //  console.log(req.body);          
  //  console.log(req.body.listing);
   // let{title, description, image, price, country, location} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
   res.redirect("/listings"); 
 })
);

//Edit Route
router.get("/:id/edit",  wrapAsync(async(req, res) => {
    let {id} = req.params;// parameter se id extract karenge
    const listing = await Listing.findById(id);//listing ko find out
    if(!listing){
      req.flash("error", "Listing you requested for does not exist!")
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
}));
// har request ke liye naya route create karna hai app.js me
//Update Route
router.put("/:id", validateListing, wrapAsync(async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  req.flash("success", "Listing Updated!")
  res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async(req, res)=>{
let{id} = req.params; //id ko extract karenge
let deletedListing = await Listing.findByIdAndDelete(id);
console.log(deletedListing);
req.flash("success", "Listing Deleted!");
res.redirect("/listings");
})
);

module.exports = router;