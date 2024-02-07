var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;
const CryptoJS = require("crypto-js");


router.get('/', (req, res) => {

    req.app.locals.db.collection("users").find().toArray()

    .then(users => {
        users.forEach(user => {
         user.id = user._id;
            delete user._id;
            delete user.password;
         });
    res.json(users);
  });
});

router.post('/', (req, res) => {
    let id = req.body.id;

    req.app.locals.db.collection("users").findOne({_id:new ObjectId(id)})
    .then(user => {
        if (user) {
            user.id = user._id;
            delete user._id;
            res.json(user);
        } else {
            res.status(404).json({message: "No user with that id!"})
        }

    })

  
});


router.post('/add', (req, res) => {

    let encryptedPassword = CryptoJS.AES.encrypt(req.body.password, process.env.SALT_KEY).toString();

    let user = {
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword
    };


    req.app.locals.db.collection("users").insertOne(user)
    .then(dbUser => {
        user.id = dbUser.insertedId;
        delete user._id;

        res.json(user);
    }
    )


    // user.id = user._id;

  
});


router.post('/login', (req, res) => {

let email = req.body.email;

req.app.locals.db.collection("users").findOne({email: email})
.then(user => {
    if (user) {
        let decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SALT_KEY).toString(CryptoJS.enc.Utf8);
        if (decryptedPassword === req.body.password) {
            user.id = user._id;
            delete user._id;
            delete user.password;
            res.json(user);
        } else {
            res.status(401).json({message: "Sorry, you can't come in."}); // wrong password
        }
    } else {
        res.status(401).json({message: "Sorry, you can't come in."}); // wrong username
    }

})


  
});






module.exports = router;
