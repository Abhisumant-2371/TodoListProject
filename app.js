// A part of code that is getting repeated over every page of the website that part we have to copy and we have to make another ejs file in the view folder and in the other pages we just have to include that file by using the expression

// <%-include("name of the file")-%>


const express = require("express");
const mongoose=require("mongoose");
const bodyParser = require("body-parser");
const { resolveInclude } = require("ejs");
const _=require("lodash")
const app = express();

// creaiting a new database
mongoose.connect("mongodb+srv://Abhisumant-2371:Test-123@cluster0.le4mp.mongodb.net/todolistDB?retryWrites=true&w=majority");

const itemsSchema=new mongoose.Schema({
    itemName:String
})

const workSchema=new mongoose.Schema({
    itemName:String
})



const Item=mongoose.model("Item",itemsSchema);
const Work=mongoose.model("Work",workSchema);
const item1=new Item({
    itemName:"Make Food",
})
const item2=new Item({
    itemName:"Eat Food",
})
const item3=new Item({
    itemName:"Sleep",
})
const defaultItems=[item1,item2,item3];

// Item.insertMany(defaultItems,(err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         // mongoose.connection.close();
//         console.log("Successfully inserted the items");
//     }
// });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req, res) => {
    
    Item.find({},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            if(result.length===0)
            {
                Item.insertMany(defaultItems,(err)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("successfully inserted");
                    }
                });
                res.render('list', {
                    listTitle: "Item List",
                    newListItems:defaultItems
                });
            }
            res.render('list', {
                listTitle: "Item List",
                newListItems:result
            });
        }
    })
    
})
app.post("/",(req,res)=>{
    let item =req.body.newEntry;
    const objitem=new Item({
        itemName:item
    });
    const listName=req.body.itemBtn;
    if(req.body.itemBtn==="Work List")
    {
        Work.create({itemName:item},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("added successfully");
            }
        })
        res.redirect("/work")
    }
    else if(req.body.itemBtn==="Item List"){
        Item.create({itemName:item},(err)=>{
            if(err){
                console.log(err);
            }
        })
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},(err,result)=>{
            result.items.push(objitem);
            result.save();
            res.redirect("/"+listName);
        })
    }

    
})
app.get("/work",(req,res)=>{
    Work.find({},(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("list",{
                listTitle:"Work List",
                newListItems:result
        
            })
        }
    })
    
})
app.post("/delete",(req,res)=>{
    const del=req.body;
    
    let key;
    for(let i in del)
    {
        key=i;
    }
    console.log(req.body.key);
    if(key==="Item")
    {
        Item.findOneAndRemove({_id:del[key]},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully deleted it");
                res.redirect("/");
            }
        })
    }
    else if(key==="Work"){
        Work.findOneAndRemove({_id:del[key]},(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully deleted it");
                res.redirect("/work");
            }
        })

    }
    else{
        List.findOneAndUpdate({name:key},{$pull:{items:{_id:del[key]}}},(err)=>{
            if(!err){
                res.redirect("/"+key);
            }
        });

    }

})
const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});

const List=mongoose.model("List",listSchema);


// Some if else statments are required to make it custom todolsit
app.get("/:topic",(req,res)=>{
    const value=_.lowerCase(req.params.topic);
    const customListName=(value);
    List.findOne({name:customListName},(err,result)=>{
        if(result===null){
            const list=new List({
                name:customListName,
                items:defaultItems
            })
            list.save();
            res.redirect("/"+customListName);
        }
        else{
            res.render("list",{
                listTitle:result.name,
                newListItems:result.items
            })
        }
    })
    
    

})
app.listen(3000, () => {
    console.log("Server listening to port 3000");
})