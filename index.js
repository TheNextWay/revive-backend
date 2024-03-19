const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
const {MONGODB_URI} = process.env

const mongoose = require('mongoose');
const uri = MONGODB_URI
const clientOptions = {};

const Token = require('./models/Token');
async function checkToken(req, res, next) {
  const tokenValue = req.params.token;
  try {
    const tokenDoc = await Token.findOne({ token: tokenValue });
    if (!tokenDoc) {
      return res.status(404).json({ error: 'Not Found' });
    }
    req.token = tokenDoc;
    next();
  } catch (error) {
    console.error("Error checking token:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Connection to MongoDB failed:", error);
  }
}

run();
async function createToken(tokenValue) {
  try {
    const token = new Token({ token: tokenValue });
    await token.save();
    console.log('Token saved successfully:', token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}
app.get('/', (req, res) => {
  res.send('Hello World🤖');  
});

app.post('/qrrawan/:token/:qr/:point', checkToken, (req, res) => {
  res.send('');
});

app.post('/claim/:token', (req, res) => {
  res.send('Claim route');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
