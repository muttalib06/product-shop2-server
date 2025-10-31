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
    // for product
    const database = client.db("productDB");
    const productCollection = database.collection("products");
    // for user
    const userDatabase = client.db("userDB");
    const userCollection = userDatabase.collection("users");
    // read all products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const products = await cursor.toArray();
      res.send(products);
    });
    // read users
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    // read use by id;
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    //create data(insert) for product
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log("New Product", newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });
    // create data for users;
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // update user ;
    app.put("/users/:id", async (req, res) => {
      const updatedUser = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc);
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
