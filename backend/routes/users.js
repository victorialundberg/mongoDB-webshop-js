var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

// get all users - id, name, email
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

// get specific user - id, name, email, password
router.post('/', (req, res) => {
    let id = req.body.id;

    console.log(id);

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

// create user - name, email, password
router.post('/add', (req, res) => {

    let user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };


    req.app.locals.db.collection("users").insertOne(user);

    user.id = user._id;
    delete user._id;

    res.json(user);
  
});

// login user - email, password
router.post('/login', (req, res) => {

// find user in db

let email = req.body.email;
let password = req.body.password;

req.app.locals.db.collection("users").findOne({email: email, password: password})
.then(user => {
    if (user) {
        user.id = user._id;
        delete user._id;
        res.json(user);
    } else {
        res.status(401).json({message: "Sorry, you can't come in."});
    }
})
  
});






module.exports = router;
