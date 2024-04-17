const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();
const { MONGODB_URI } = process.env;

const mongoose = require("mongoose");
const uri = MONGODB_URI;
const clientOptions = {};
const Token = require("./models/Token");

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
  }
}

run();
app.get("/", (req, res) => {
  res.send("Hello World🤖");
});

app.post("/check/:token", async (req, res) => {
  const tokenValue = req.params.token;
  try {
    const tokenDoc = await Token.findOne({ token: tokenValue });
    if (!tokenDoc) {
      res.status(404);
    } else {
      if (tokenDoc.claimed == true) {
        res.status(200);
        res.send(tokenDoc.name);
      } else {
        res.status(204);
      }
    }
  } catch (error) {
    console.error("Error checking token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/qrrawan/:token/:point", async (req, res) => {
  const tokenValue = req.params.token;
  const point = req.params.point;
  const tokenDoc = await Token.findOne({ token: tokenValue });
  if (!tokenDoc) {
    res.status(406);
  } else {
    try {
      const token = new Token({ token: tokenValue, point: point });
      await token.save();
      res.status(200);
    } catch (error) {
      res.status(500)
      console.error("Error saving token:", error);
    }
  }
});

app.post("/claim/:token/:nama", async (req, res) => {
  const tokemValue = req.params.token;
  const nama = req.params.nama;
  try {
    const tokenDoc = await Token.findOne({ token: tokenValue });
    if (!tokenDoc) {
      res.status(404).json({ error: "Not Found" });
    } else {
      if (tokenDoc.claimed == true) {
        res.status(204);
      } else {
        await Token.updateOne(
          { token: tokemValue },
          { $set: { name: nama, claimed: true } },
          function (err, ress) {
            if (err) {
              res.status(500).json({ error: "Internal Server Error" });
              throw err;
            }
            res.status(200);
            res.send(tokenDoc.point);
          }
        );
      }
    }
  } catch (error) {
    console.error("Error checking token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
