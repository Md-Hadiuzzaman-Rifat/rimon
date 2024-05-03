const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

// username : donation
// password : YxTrghoTpbUSfSrX

const port = process.env.port || 2020;
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());


//Add a Mongodb URL
const uri = `mongodb+srv://donation:YxTrghoTpbUSfSrX@firstcluster.mxvk5xz.mongodb.net/`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// rename the user and collection
const database = client.db("donations");
const userList = database.collection("users");
const loanList = database.collection("loanList");
const offerList = database.collection("offerList");




app.get("/", (req, res) => {
  res.send("Hello World!");
});

// create logged in users collection
app.post("/addUser", async (req, res) => {
  try {
    const user = req.body;
    const filter = { email: user.email };
    const option = { upsert: true };
    const updateDoc = { $set: user };
    const result = await userList.updateOne(filter, updateDoc, option);
    res.json(result);
  } catch {
    console.log("Failed to insert user.");
  }
});

// post for loan
app.post("/loanPost", async (req, res) => {
  try {
    const {
      name,
      amount,
      cause,
      desc: description,
      email,
      uid,
    } = req.body || {};
    const result = await loanList.insertOne({
      name,
      email,
      uid,
      amount,
      cause,
      description,
    });
    console.log(result);
    res.json(result);
  } catch {
    console.log("Failed to Create new Loan post");
  }
});

// find the specific loan List needed person using his user id
app.get("/userLoan/:uid", async (req, res) => {
  try {
    const uid = req.params.uid;
    const loans = await loanList.find({ uid });
    const result = await loans.toArray();
    res.send(result);
  } catch {
    console.log("Failed to Get specific users loan post");
  }
});

// find the single loanPost by id
app.get("/singleLoan/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    let loan = await loanList.findOne({ _id: id });
    res.send(loan);
  } catch {
    console.log("Failed to Get specific users loan post");
  }
});

// find all loan post
app.get("/allLoanPost", async (req, res) => {
  try {
    const loans = await loanList.find({});
    const result = await loans.toArray();
    res.send(result);
  } catch {
    console.log("Failed to Get all loan post");
  }
});

// post for accept loan request
app.post("/offerLoan", async (req, res) => {
  try {
    console.log(req.body);
    const result = await offerList.insertOne(req.body);
    console.log(result);
    res.json(result);
  } catch {
    console.log("Failed to Create new Offer loan request");
  }
});

// find responses of single loan post.
app.get("/responses/:loanId", async (req, res) => {
  try {
    const loanId = req.params.loanId;
    console.log(loanId);
    const loans = await offerList.find({ loan_id: loanId });
    const result = await loans.toArray();
    res.send(result);
  } catch {
    console.log("Failed to Get specific users loan post");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
