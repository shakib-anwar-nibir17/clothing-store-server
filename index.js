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
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//collection name

const productsCollection = client.db("yzStore").collection("products");

// const categoryCollection = client.db("luminaLibrary").collection("category");
// const booksCollection = client.db("luminaLibrary").collection("books");
// const borrowCollection = client.db("luminaLibrary").collection("borrow");

// app.get("/category", async (req, res) => {
//   const cursor = categoryCollection.find();
//   const result = await cursor.toArray();
//   res.send(result);
// });
// app.get("/category/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: new ObjectId(id) };
//   const result = await categoryCollection.findOne(query);
//   res.send(result);
// });

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

// base of the express app
app.get("/", (req, res) => {
  res.send("Running YZ store Server");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
