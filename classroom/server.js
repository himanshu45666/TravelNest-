const express = require("express");
const app = express();// yha pe hmne ek express app bana li
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
// const cookieParser = require("cookie-parser");
// to bydefault jaise hi maine apne session ko as a middleware use kar liya uske ander kuch secret add kar diya

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash()); 

app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register",(req,res)=>{ // jab bhi request bhej rhe hai /register ko
  let {name = "anonymous"} = req.query;
  req.session.name = name; // req.session 
  if(name === "anonymous"){
  req.flash("error", "user not registered");
  }
  else{
    req.flash("success", "user registered successfully!");// client side pe isko render karne ke liye hm views ka use kar skate hai  
  }
  res.redirect("/hello");
});
// ek aur apne liye route banayenge
app.get("/hello", (req,res)=>{
res.render("page.ejs",{name: req.session.name});
});

// app.get("/reqcount",(req,res)=>{ 
//     if(req.session.count) { // req.session is a object
//         req.session.count ++;
//     } else{
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// });
// app.get("/test",(req,res)=>{ // app.get ke ander ek route bana lete hai aur ye hai test route
// res.send("test successful!");
// });
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req, res)=>{
//    res.cookie("made-in","India", {signed: true});
//    res.send("signed cookie send");
// });

// app.get("/verify", (req, res)=> {
//   console.log(req.signedCookies);  
//   res.send("verifies");  
// });
// // isme hm response me apne cookies ko send kar skte hai
// app.get("/getcookies",(req, res)=> { // getcookies ke pass request bhejenge
//   res.cookie("greet", "hello");// localhost:3000 (route route)
//   res.cookie("madeIn", "India");
//   res.send("sent you some cookies!") //response me send kar skte hai
// });

// app.get("/greet", (req, res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi, ${name}`);
// });
// // apne kisi route se apne cookie ko bhej diya
// // sath ke sath ke hm isme ek basic route create kar dete hai
// app.get("/",(req,res) => {
//     console.dir(req.cookies);// directly req se cookies se parse kar pana possible nhi hota server ke liye
//     res.send("Hi, I am root!")
// });

// app.use("/users",users);//router
// app.use("/posts",posts);


//hm jab real website banate hai to wha pe kewal one line of code nhi hoto
// callback ke ander balki multiple line of code hoti

app.listen(3000,() => {
    console.log("server is listening to 3000");
})