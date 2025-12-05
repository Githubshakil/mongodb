const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(cors());

//connecting to mongodb

const uri =
  "mongodb+srv://shakilmahmud007_db_user:PibrLeUwiStxHBk3@mongodb-basic.dncnpdh.mongodb.net/?retryWrites=true&w=majority&appName=mongodb-basic";

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

    //create DB collection
    const db = client.db("mydatabase");
    const usersCollection = db.collection("users");

    //add new users collection
    app.post("/add-user", async (req, res) => {
      try {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        res.status(200).json({
          message: "User created successfully",
          result,
        });
      } catch (error) {
        res.status(400).json({
          message: "Failed to create user",
        });
      }
    });

    // find all user
    app.get("/users", async (req, res) => {
      try {
        const users = await usersCollection.find().toArray();

        res.status(200).json(users);
      } catch (error) {
        res.status(403).json({
          message: "Failed to fetch user",
          error,
        });
      }
    });

    // find single user
    app.get("/users/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
          return res.status(404).json({
            message: "user not found",
          });
        }

        res.status(200).json(user);
      } catch (error) {
        res.status(403).json({
          message: "Failed to fetch user",
          error,
        });
      }
    });

    //find users by email
    app.get("/users/user/:email", async (req, res) => {
      try {
        const user = await usersCollection
          .find(
            { email: req.params.email, age: { $gt: 38 } },
            { projection: { name: 0 } }
          )
          .toArray();

        res.json(user);
      } catch (error) {
        res.status(403).json({
          message: "Failed to fetch user",
          error,
        });
      }
    });

    //update information to db
    app.patch("/update-user/:id", async (req, res) => {
      const { id } = req.params;

      const userData = req.body;
      try {
        const filter = { _id: new ObjectId(id) };

        const updateInfo = {
          $set: {
            ...userData
          },
        };

        const options = { upsert: true };

        const result = await usersCollection.updateOne(filter,updateInfo,options);

        res.json(result)
      } catch (error) {
        res.status(403).json({
          message: "Failed to update user",
          error,
        });
      }
    });

    app.patch("/users/increase-age", async (req,res)=>{
      try {
        const result = await usersCollection.updateMany(
         {}, { $set: { status: "pending" } }
        );
        res.json(result)
      } catch (error) {
        res.status(403).json({
          message: "Failed to update users age",
          error,
        });    
      }
    })

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

// ---------------------------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello MongoDB!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// shakilmahmud007_db_user
//PibrLeUwiStxHBk3
