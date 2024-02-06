var express = require('express');
var router = express.Router();
var ObjectId = require("mongodb").ObjectId;

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

router.get('/all', (req, res) => {



    req.app.locals.db.collection("orders").find().toArray()
        .then(orders => {
            orders.forEach(order => {
                order.id = order._id;
                delete order._id;
            });
            res.json(orders);
        })


})

module.exports = router;