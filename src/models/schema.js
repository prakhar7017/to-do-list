const mongoose=require("mongoose");
const validator=require("validator");

const itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        validator(value){
            if(validator.isEmpty(value)){
                throw new Error("New List-Item is required");
            }
        }
    }
});

const Item=mongoose.model("Item",itemSchema);

module.exports={
    Item:Item,
    itemSchema:itemSchema
};
