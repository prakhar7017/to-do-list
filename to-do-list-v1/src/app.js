require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const _= require("lodash");
const date = require("./models/date");
const Item = require("./models/schema");
const List = require("./models/listSchema");
require("./db/connection");
const app = express();

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../views");

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", views_path);

let newAdds = [];
let workitems = [];

const item1 = new Item.Item({ name: "welcome to-do-list" });
const item2 = new Item.Item({ name: "Click on + to add new item" });
const item3 = new Item.Item({ name: "<---to delete an item" });

const defaultItem = [item1, item2, item3];

app.get("/", function (req, res) {
  let day = date.getDate();

  Item.Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      Item.Item.insertMany(defaultItem, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("saved successfully");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newlistitems: founditems });
    }
  });
}); 

app.get("/:customeListname",(req,res)=>{
  try {
    const customelistname=_.capitalize(req.params.customeListname);
    List.findOne({name:customelistname},function(err,foundList){
      if(!err){
        if(!foundList){
          //create list
          const addlist= new List({name:customelistname,items:defaultItem});
          addlist.save();
          res.redirect("/"+customelistname);
        }else{
          //show an existing list
          res.render("list",{listTitle:foundList.name,newlistitems:foundList.items});
        }
      }
    })
  } catch (e) {
    console.log(e);
  }
})


app.post("/", (req, res) => {
  let itemName = req.body.new_item;
  let listname=req.body.list;
  console.log(listname);
  
  const addItem = new Item.Item({ name: itemName });

  if(listname===date.getDate()){
    addItem.save();
    res.redirect("/");
  }else{
    List.findOne({name:listname},function(err,foundList){
      foundList.items.push(addItem);
      foundList.save();
      res.redirect("/"+listname);
    })
  }
});

app.post("/delete",(req,res)=>{
  const checkedItemid=req.body.checkbox;
  const customelistName=req.body.listName;
  if(customelistName===date.getDate()){
    Item.Item.findByIdAndRemove(checkedItemid,function(err){
      if(err){
        console.log(err);
      }else{
        console.log("deleted successfully");
      }
    })
    res.redirect("/");  
  }else{
    List.findOneAndUpdate({name:customelistName},{$pull:{items:{_id:checkedItemid}}},function(err,foundList){
      if(!err){
         res.redirect("/"+customelistName);
      }
    })
  }
})

app.listen(process.env.PORT||3000, function () {
  console.log("server has started on port 80");
});












