var express = require('express');
var router = express.Router();
// var ObjectId = require("mongodb").ObjectId;

// Add category
router.post('/add', (req, res) => {

    let category = {
        name: req.body.name
    };

    let token = req.body.token;

    if (token == process.env.ADD_CATEGORY_TOKEN) {
        req.app.locals.db.collection("categories").insertOne(category);
        delete category._id;

        res.json(category);
    } else {
        res.status(401).json({message:"You are not allowed to add categories."})
    }

})

// Get all categories

router.get('/', (req, res) => {

    req.app.locals.db.collection("categories").find().toArray()

    .then(categories => {
        categories.forEach(category => {
            category.id = category._id;
            delete category._id;
        });
     res.json(categories);
    });
})

module.exports = router;