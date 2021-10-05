const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require("../middleware/authenticate");


require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send('Hello world from the server router js');
});


// USING PROMISE METHOD--------------------|

// router.post('/register', (req, res) => {

//     const { name, email, phone, work, password, cpassword } = req.body

//     if (!name || !email || !phone || !work || !password || !cpassword) {
//         return res.status(422).json({ error: "plz filled properly in blank place" })
//     }


//     User.findOne({ email: email })
//         .then((userExist) => {
//             if (userExist) {
//                 return res.status(422).json({ error: "Email already exist" })
//             }

//             const user = new User({ name, email, phone, work, password, cpassword })

//             user.save().then(() => {
//                 res.status(201).json({ message: "user registered successfully" });
//             }).catch((err) => res.status(500).json({ error: "failed to registered" }));

//         }).catch(err => { console.log(err); });


// });


// ASYNC AWAIT----------------
router.post('/register', async (req, res) => {

    const { name, email, phone, work, password, cpassword } = req.body

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plz filled properly in blank place" })
    }

    try {
        const userExist = await User.findOne({ email: email })

        if (userExist) {
            return res.status(422).json({ error: "Email already exist" })
        } else if (password != cpassword) {
            return res.status(422).json({ error: "password not match" })
        } else {
            const user = new User({ name, email, phone, work, password, cpassword })

            await user.save();
            res.status(201).json({ message: "user registered successfully" });


        }




    } catch (err) {
        console.log(err);

    }

});


// LOGIN PAGE.................\

router.post('/signin', async (req, res) => {
    // console.log(req.body)
    // res.json({message: "awesome"})

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "plz filled the data" })
        }

        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();
            console.log(token);

            res.cookie("jwtoken" , token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true

            });

            if (!isMatch) {
                res.status(400).json({ error: "invalid credentials pass" })

            } else {
                res.json({ message: "user Signin Successfully" })

            }
        } else {
            res.status(400).json({ error: "invalid credentials" });
        }



    } catch (err) {
        console.log(err);

    }

   

    


});

 // aboutus ka page

router.get('/about',authenticate, (req , res)=>{
    console.log(`Hello my about`);
    res.send(req.rootUser);
});


// get user data for contact page and home page
router.get('/getdata',authenticate, (req , res)=>{
    console.log(`Hello my getdata`);
    res.send(req.rootUser);
});

// contact us page
router.post('/contact',authenticate, async (req , res)=>{
     try {

        const {name , email,phone,message} = req.body;

        if (!name || !email  ||  !phone || !message){
            console.log("error in contact form")
            return res.json({error: "plz filled the conatct form"})
        } 

        const userContact = await User.findOne({ _id: req.userID });

        if(userContact) {
            const userMessage = await userContact.addMessage(name , email, phone , message);

            await userContact.save();

            res.status(201).json({message:"user contact succesfully"})
        }

     } catch (error){
        console.log(error)
     }
});


 // logout ka page

 router.get('/logout',(req , res)=>{
    console.log(`Hello my Logout page`);
    res.clearCookie('jwtoken', {path:'/'})
    res.status(200).send('user logout');
});






module.exports = router;