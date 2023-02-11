const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("api key");
const nodemailer = require("nodemailer");
const YOUR_DOMAIN = "http://localhost:3000";

// static files
app.use(express.static(path.join(__dirname, "views")));

// middleware
app.use(express.json());

// routes
app.post("/payment", async (req, res) => {
    const { product } = req.body;
    const username =req.body;
    console.log(username);
    console.log(product.username);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: product.amount * 100,
                },
                quantity: product.quantity,
            },
        ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/checkout.html`,
    });

    res.json({ id: session.id });

async function main() {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, 
    auth: {
      user: "mailid", 
      pass: "pass", 
    },
  });

  let info = await transporter.sendMail({
    from: "mail id", 
    to: product.email,
    subject: "Amount Donated", 
    html:"Successfully Donated.<br>"+
    "Details:<br><br>"+
    "<b>Name : </b>"+product.username+
    "<br><b>Amount : </b>"+product.amount+"Rs"+
    "<br><b>Date </b>: 11/02/2023"+
    "<br><b>Receiver </b>: Sparks Foundation NGO"+
    "<br><b>Payment Method </b>: Card"+
    "<br><br>Thank you for your Contribution."+
    "<br>Regards",
  });

}

main().catch(console.error);

});


// listening...
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
