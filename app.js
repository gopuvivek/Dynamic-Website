const express = require('express');
const mongoose = require('mongoose');
const Stock = require('./models/stock');
const app = express();

app.set('view engine','ejs');

app.listen(5000,()=>{
    console.log('Listening on Port 5000');
});
//const dbURI = 'mongodb://127.0.0.1:27017/autostores';
const dbURI = 'mongodb://topuser:munich@cluster0-shard-00-00.ebjho.mongodb.net:27017,cluster0-shard-00-01.ebjho.mongodb.net:27017,cluster0-shard-00-02.ebjho.mongodb.net:27017/autostores?ssl=true&replicaSet=atlas-gf9lrf-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true})
.then((result)=>console.log("Connected to DB!"))
.catch((err)=>console.log(err));


app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.get('/',(req,res)=>{
    res.render('index.ejs',{title:"Home"});
});

app.get('/admin-content',(req,res)=>{
    res.render('admin',{title:"Admin Content"});
});

app.get('/get-auto',(req,res)=>{
    Stock.find().sort({createdAt:-1})
    .then((result)=>{
        res.render('alter',{title:"Stock",result});
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/get-auto/:brand',(req,res)=>{
    Stock.find({"brand":req.params.brand}).sort({createdAt:-1})
    .then((result)=>{
        res.render('viewauto',{brand:req.params.brand,title:"Stock",result})
    })
    .catch((err)=>{
        console.log(err);
    })
});

app.get('/delete/:id',(req,res)=>{
    Stock.deleteOne({"_id":req.params.id})
    .then((result)=>{
        res.redirect('/get-auto');
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.get('/add-auto',(req,res)=>{
    res.render('addauto',{title:"Add Stock",href:"/add-auto",auto:{
        brand:"Brand",
        model:"Model",
        price:"0",
        quantity:"0"
    },action:"Add Stock"});
})
app.get('/add-auto/:id',(req,res)=>{
    Stock.find({"_id":req.params.id})
    .then((result)=>{
        res.render('addauto',{title:"Update Stock",href:`/update-auto/${req.params.id}`,auto:result[0],action:"Update Stock"});
    })
    .catch((err)=>{
        console.log(err);
    })
})
app.post('/update-auto/:id',(req,res)=>{
    Stock.updateOne({"_id":req.params.id},
    {$set:{brand:req.body.brand,
        model:req.body.model,
        price:req.body.price,
        quantity:req.body.quantity}})
    .then((result)=>{
        res.redirect('/get-auto')
    })
    .catch((err)=>{
        console.log(err);
    })
});
app.post('/add-auto',(req,res)=>{
    stock = new Stock({
        brand:req.body.brand,
        model:req.body.model,
        price:req.body.price,
        quantity:req.body.quantity
    }),

    stock.save()
    .then((result)=>{
        res.redirect('/get-auto')
    })
    .catch((err)=>{
        console.log(err);
    })
});