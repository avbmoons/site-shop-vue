const express = require("express");
const fs = require("fs");

const port = 3000;
const static_dir = "../public";

const app = express();

app.use(express.json());

app.use(express.static(static_dir));

app.get("/catalogData", (req, res) => {
  fs.readFile("data/catalog.json", "utf8", (err, data) => {
    const catalog = JSON.parse(data);
    console.log("list", catalog);
    res.send(data);
  });
});

app.post("/addToCart", (req, res) => {
  fs.readFile("data/cart.json", "utf8", (err, data) => {
    const cart = JSON.parse(data);

    let id = 1;

    if (cart.length > 0) {
      let id = cart[cart.length - 1].id_product + 1;
    }

    const item = req.body;
    item.id_product = id;

    cart.push(item);

    fs.writeFile("data/cart.json", JSON.stringify(cart), (err) => {
      console.log("done-1", cart);
      res.end();
    });
  });
});

app.get("/cart", (req, res) => {
  fs.readFile("data/cart.json", "utf8", (err, data) => {
    res.send(data);
  });
});

app.post("/removeFromCart", (req, res) => {
  fs.readFile("data/cart.json", "utf8", (err, data) => {
    const cart = JSON.parse(data);

    let id = 1;

    if (cart.length > 0) {
      let id = cart[cart.length - 1].id_product + 1;
    }

    const item = req.body;
    item.id_product = id;

    cart.splice(item, 1);

    fs.writeFile("data/cart.json", JSON.stringify(cart), (err) => {
      console.log("done-2");
      res.end();
    });
  });
});

app.listen(port, function () {
  console.log("server is running on port " + port + "!");
});
