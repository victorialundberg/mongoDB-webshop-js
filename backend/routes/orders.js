var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

// Add order

router.post('/add', (req, res) => {


    let order = {
        user: req.body.user,
        products: []
    }

    req.body.products.forEach(orderProduct => {

        req.app.locals.db.collection("products").updateOne({_id:new ObjectId(orderProduct.productId)}, {$inc:{lager: - orderProduct.quantity}});

        order.products.push({productId: orderProduct.productId, quantity: orderProduct.quantity});

    });

    req.app.locals.db.collection("orders").insertOne(order)

    delete order._id;

    res.json(order);

});

// Get all orders

router.get('/all', (req, res) => {

    let key = req.query.apikey;

    if (key == process.env.GET_ALL_ORDERS_KEY) {
        req.app.locals.db.collection("orders").find().toArray()
        .then(orders => {
            orders.forEach(order => {
                order.id = order._id;
                delete order._id;
            });
            res.json(orders);
        })
    } else {
        res.status(401).json({message: "You need a key to see all orders!"})
    }

})

// Get orders for a specific user

router.post('/user', (req, res) => {

    let token = req.body.token;

    if (token) {
        if (token == process.env.ADD_PRODUCT_TOKEN) {
            req.app.locals.db.collection("orders").find().toArray()
            .then(orders => {
                orders.forEach(order => {
                    order.id = order._id;
                    delete order._id;
                });
                res.json(orders);
            })
        } else {
            res.status(401).json({message: "You need the right key to see this."})
        }
    } else {
        res.status(401).json({message:"You need a key to see this."})
    }




})


module.exports = router;