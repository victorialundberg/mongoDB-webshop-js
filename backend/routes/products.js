var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;


// Get all products
router.get('/', (req, res) => {

    req.app.locals.db.collection("products").find().toArray()

    .then(products => {
        products.forEach(products => {
            products.id = products._id;
            delete products._id;
        });
     res.json(products);
    });
});

// Get specific product
router.get('/:id', (req, res) => {
    let id = req.params.id;

    req.app.locals.db.collection("products").findOne({_id:new ObjectId(id)})
    .then(product => {
        if (product) {
            delete product._id;
            res.json(product);
        } else {
            res.status(404).json({message: "No product with that id!"})
        }

    })
})

// Add product
router.post('/add', (req, res) => {

    let product = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        lager: req.body.price
    };

    req.app.locals.db.collection("products").insertOne(product);

    delete product._id;

    res.json(product);
})




module.exports = router;