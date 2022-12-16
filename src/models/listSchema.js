const itemSchema=require("./schema");
const mongoose=require("mongoose");
const validator=require("validator");
const value=require("./schema");

const listSchema=new mongoose.Schema({
    name:String,
    items:[value.itemSchema]
})

const List=mongoose.model("List",listSchema);
module.exports=List;