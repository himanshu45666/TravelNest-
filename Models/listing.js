const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// reviews wale model ko use karna padega to usse pahle hm ise require kar lete hai
const Review = require("./review.js");

const listingSchema = new Schema({
   title: {
     type: String,
        required: true,
   },
   description: String,
   image: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNUjZGUm6sE8823L4ONVIm-mJeBXp1roxvKA53OyqOd-lzwn-11fzBd-1&s=10",
    set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNUjZGUm6sE8823L4ONVIm-mJeBXp1roxvKA53OyqOd-lzwn-11fzBd-1&s=10" : v, 
   },
   price: Number,
   location: String,
   country: String,
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",
      },
   ],
   });

//post mongoose middleware ko create karenge
//findOneAndDelete ke liye hm ek async type ka middleware define karenge
listingSchema.post("findOneAndDelete", async (listing) => {
if(listing) {
await Review.deleteMany({_id :{ $in: listing.reviews }});//hme us reviews ko delete karna hai jo hmari listing ke reviews wale array ke ander aate hai
}
});

// isi Schema ka use karke hm ek model create karne wale hai
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;