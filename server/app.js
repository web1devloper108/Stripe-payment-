require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")("sk_test_51NjHgCSFzq7ZkV5cfZeJk0nTg7rFyroamy2GUEeT4JjYHlgjwLowXM1vALEYBIDdIqWX8sh5uf6bWctBQF4ZRr6O0090Y8uonp");    /////////process.env.STRIPE_SECRET

app.use(express.json());
app.use(cors());

//  api check
app.post("/api/create-checkout-session",async(req,res)=>{
    const {products} = req.body;
    

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:product.dish, 
                images:[product.imgdata]
            },
            unit_amount:product.price * 100,   ////100 means, price show after two decimal
        },                                     //here write 10000, op showes 100
        quantity:product.qnty
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/sucess",     ///frontend port
        cancel_url:"http://localhost:3000/cancel",       ///frontend port
    });

    res.json({id:session.id})
 
})


app.listen(8000,()=>{
    console.log("server start....")
})