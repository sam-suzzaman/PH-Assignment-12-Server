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

        // ==== Setting API to load Limited TOOLS =======
        app.get("/toolsLimit", async (req, res) => {
            const query = {};
            const cursor = toolCollection.find(query).limit(6);
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

        // ==== Setting API to load ALL TOOLS =======
        const reviewCollection = client.db("Tools_Shop").collection("Reviews");
        app.get("/reviews", async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // ==== Setting API to load Blogs Data =======
        const blogCollection = client.db("Tools_Shop").collection("Blog-Data");
        app.get("/blogs", async (req, res) => {
            const query = {};
            const cursor = blogCollection.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // ==== Setting API to load Portfolio-Project Data =======
        const projectCollection = client
            .db("Tools_Shop")
            .collection("portfolio-project");
        app.get("/portfolioProject", async (req, res) => {
            const query = {};
            const cursor = projectCollection.find(query);
            const projects = await cursor.toArray();
            res.send(projects);
        });

        // ==== Setting API to load Portfolio-Skill Data =======
        const skillCollection = client
            .db("Tools_Shop")
            .collection("portfolio-skill");
        app.get("/portfolioSkill", async (req, res) => {
            const query = {};
            const cursor = skillCollection.find(query);
            const skills = await cursor.toArray();
            res.send(skills);
        });

        // ==== Setting API to load Portfolio-Skill Data =======
        const heroCollection = client.db("Tools_Shop").collection("Hero");
        app.get("/hero", async (req, res) => {
            const query = {};
            const cursor = heroCollection.find(query);
            const hero = await cursor.toArray();
            res.send(hero);
        });

        //  #### Post API for Placing Order ####
        const orderCollection = client.db("Tools_Shop").collection("Orders");
        app.post("/order", async (req, res) => {
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        });

        //  ++++ Update Order-Quantity +++
        app.put("/order/:id", async (req, res) => {
            const id = req.params.id;
            const updatedTool = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    orderQuantity: updatedTool.orderQuantity,
                },
            };
            const result = await toolCollection.updateOne(
                filter,
                updatedDoc,
                options
            );
            res.send(result);
        });
    } finally {
        // generally disconnect connection
    }
}
run().catch(console.dir);

//  ====== API Testing
app.get("/", (req, res) => {
    res.send("tools kit server running");
});

app.listen(port, () => {
    console.log(` listening on port ${port}`);
});
