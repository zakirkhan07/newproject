const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser'); 


const app = express();
app.use(cookieParser());

dotenv.config({path : './config.env'})

require('./db/conn');
const User = require('./model/userSchema');



app.use(express.json());


// we link the router files to make our route
app.use(require('./router/auth'));



const PORT = process.env.PORT;



// app.get('/contact', (req , res)=>{
//     res.cookie("text","faishal");
//     res.send(`this is contact page`)
// })

app.get('/signin', (req , res)=>{
    res.send(`this is signin page`)
})

app.get('/registration', (req , res)=>{
    res.send(`this is registration page`)
})

app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`)
})