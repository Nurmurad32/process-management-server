const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const processRoutes = require('./routes/processRoutes');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhdrfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const processCollection = client.db("processManagement").collection('processes');
    
    // Middleware
    app.use((req, res, next) => {
      req.processCollection = processCollection;
      next();
    });

    // Routes
    app.use('/api', processRoutes);

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Md. Nur-A-Alam Khan Process-Management Server is running");
});

app.listen(port, () => {
  console.log(`Md. Nur-A-Alam Khan Process-Management Server is running on port ${port}`);
});
