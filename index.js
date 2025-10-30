const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://appUser:Qt8VHbMv50QuXQxn@cluster3.rsapi6v.mongodb.net/?appName=Cluster3";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Server is running on the main api");
});

async function run() {
  try {
    // connect the client to the server
    await client.connect();

    // create database and collection reference;
    const database = client.db("productDB");
    const productCollection = database.collection("products");
    // read all products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });
    //create data(insert)
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log("New Product", newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });
    // send a ping to confirm successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "pinged your deployment. You successfully connected to MongoDB"
    );
  } finally {
    //     await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
