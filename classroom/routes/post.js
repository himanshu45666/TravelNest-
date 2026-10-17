const express = require("express");
const router = express.Router();

//Index route 
router.get("/",(req,res) =>{
   res.send("GET for posts");
});

//Show route 
router.get("/:id",(req,res) =>{
   res.send("GET for posts id");
});

//Post route 
router.post("/",(req,res) =>{
   res.send("POST for post");
});

//Delete route
router.delete("/:id",(req,res) =>{
   res.send("DELETE for posts id");
});

module.exports = router;