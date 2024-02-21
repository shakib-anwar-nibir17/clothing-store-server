const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ------------MONGO DB --------------\\
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctziwlh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//collection name

const productsCollection = client.db("yzStore").collection("products");
const cartCollection = client.db("yzStore").collection("carts");

app.get("/products", async (req, res) => {
  const cursor = productsCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await productsCollection.findOne(query);
  res.send(result);
});

app.put("/products/:id", async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  const updatedProduct = req.body;
  console.log(id, updatedProduct);
  const filter = { _id: new ObjectId(id) };

  const options = { upsert: true };

  const ProductDoc = {
    $set: {
      image: updatedProduct.image,
      brand: updatedProduct.brand,
      rating: updatedProduct.rating,
      name: updatedProduct.name,
      details: updatedProduct.details,
      type: updatedProduct.type,
      price: updatedProduct.price,
    },
  };
  console.log(ProductDoc);
  const result = await productsCollection.updateOne(
    filter,
    ProductDoc,
    options
  );
  res.send(result);
});

app.post("/products", async (req, res) => {
  const newProduct = req.body;
  const result = await productsCollection.insertOne(newProduct);
  res.send(result);
});

app.post("/carts", async (req, res) => {
  const cartItem = req.body;
  const result = await cartCollection.insertOne(cartItem);
  res.send(result);
});

app.get("/carts", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await cartCollection.find(query).toArray();
  res.send(result);
});

// base of the express app
app.get("/", (req, res) => {
  res.send("Running YZ store Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
