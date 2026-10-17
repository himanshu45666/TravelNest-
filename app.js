const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
//Const MONGO_URL se await mongoose tak code basic connection code hai
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
//ab ejs-mate ke insatallation ke baad hm ise require kar lenge
const ejsMate = require("ejs-mate");
//ejs-mate hme help karta hai kai saare template create karne me route create karne me
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

main()
  .then(()=> {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//include and parsel jaisa hoga
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
   res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());// es flash ko hm routes ki help se use karne wale hai

//hm apne response se local variable ke ander access kar skte hai
// middleware creation
app.use ((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();//agar next ko call nhi karenege to isi middleware pe hm stuck ho kar rh jaayenge
});

app.use("/listings", listings);//app.use ke routes ko pass kar rhe hai
app.use("/listings/:id/reviews", reviews); 

//yha par listing ke ander hmne listing ko access kar liya hai 
// app.get("/testListing", async (req, res) => { // yha per hm ek naya route create kar denge
//   let sampleListing = new Listing({//yha per apne model ko access karke hm ek naya document crete karne ka try karenge
//    title: "My New Villa",
//    description: "By the beach",
//    price: 1200,
//    location: "Calangute, Goa",
//    country: "India", 
//   });// es tareeke se hm ek sample listing apne liye create kar lenege
//   // es sample listing hm databas ke ander save karane wale hai

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("succesful testing");
// }) 

app.use((req,res,next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Express wala middleware define kiya hai
app.use((err, req, res,next) => {
   let {statusCode = 500, message = "Something went wrong!"} = err;
   res.status(statusCode).render("error.ejs",{message});
  //  res.status(statusCode).send(message);
 });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});