const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// ======= Middle wares
app.use(cors());
app.use(express.json());

// ====== Mongo Connection

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k1gqm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// ======== API Start
async function run() {
    try {
        await client.connect();
        const toolCollection = client.db("Tools_Shop").collection("Tools");

        // ==== Setting API to load ALL TOOLS =======
        app.get("/tools", async (req, res) => {
            const query = {};
            const cursor = toolCollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        // === Setting API to load Single Tool ====
        app.get("/tools/:toolID", async (req, res) => {
            const ID = req.params.toolID;
            const query = { _id: ObjectId(ID) };
            const tool = await toolCollection.findOne(query);
            res.send(tool);
        });
    } finally {
        // generally disconnect connection
    }
}
run().catch(console.dir);

//  ====== API Testing
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(` listening on port ${port}`);
});
