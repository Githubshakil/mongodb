const express = require("express");
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;

//middleware
app.use(express.json())
app.use(cors())

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
    const db = client.db('mydatabase')
    const usersCollection = db.collection("users")
    

    //add new users collection
    app.post("/add-user", async (req,res)=>{
      const newUser = req.body
      const result = await usersCollection.insertOne(newUser)
      console.log(result)
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
