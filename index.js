import express from "express";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
const app = express();

//middleware to parse incoming stringified req objects

app.use(express.json());

// Connection URL
const url =
  "mongodb+srv://Comrade:YdYOH6vPu4GFCIoX@cluster0.wttchje.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

// Database Name
const dbName = "TodoApp";

async function ConnectMongo() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("todos");
    console.log("Connected to MongoDB Atlas server 🎉🎉🎉");
    return collection;
  } catch (error) {
    if (error instanceof MongoServerError) {
      console.log(`Error worth logging: ${error}`); // special case for some reason
    }
    throw error; // still want to crash
  }
}

const collection = await ConnectMongo();

//routes
app.get("/app", function (req, res) {
  res.send("Hello World");
});

app.post("/todo", async (req, res) => {
  try {
    const insertResult = await collection.insertOne(req.body);
    console.log(insertResult);
    res.send(insertResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const findResult = await collection.find({}).toArray();
    console.log(findResult);
    res.send(findResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.get("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const findResult = await collection.findOne({ _id: new ObjectId(id) });
    console.log(findResult);
    res.send(findResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, completed } = req.body;
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title: title, completed: completed } }
    );

    console.log(updateResult);
    res.send(updateResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log(deleteResult);
    res.send(deleteResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
