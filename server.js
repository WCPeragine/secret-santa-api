const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signIn = require("./controllers/signin");
const giftee = require("./controllers/giftee");
const wishlist = require("./controllers/wishlist");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("It's working");
});

app.post("/signin", (req, res) => {
  //req.body requires email & password
  //res.body responds with all the user's info
  signIn.handleSignIn(req, res, db, bcrypt);
});

app.post("/register", (req, res) => {
  //req.body requires email & password
  //res.body responds with all the user's info
  register.handleRegister(req, res, db, bcrypt);
});

app.post("/giftee/select", (req, res) => {
  //req.body requires user_id, spouse_id, group_id
  //res.body responds with the giftee_id
  giftee.selectGiftee(req, res, db);
});

app.post("/wishlist/user", (req, res) => {
  //req.body requires user_id
  //res.body responds with the user's wishlist
  wishlist.userWishlist(req, res, db);
});

app.post("/wishlist/user/rank", (req, res) => {
  //req.body requires giftUp, giftDown, user_id
  //res.body responds with confirmation
  wishlist.handleRank(req, res, db);
});

app.post("/wishlist/user/add", (req, res) => {
  //req.body requires user_id, giftLength, gift_name, gift_link, comments
  //res.body responds with confirmation
  wishlist.handleNewItem(req, res, db);
});

app.post("/wishlist/user/remove", (req, res) => {
  //req.body requires user_id, gift_name, gift_rank
  //res.body responds with confirmation
  wishlist.removeItem(req, res, db);
});

app.listen(process.env.PORT || 4001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
