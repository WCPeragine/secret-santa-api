const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signin');
const giftee = require('./controllers/giftee')


const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send("It's working");
})

app.post('/signin', (req, res) => {
	signIn.handleSignIn(req, res, db, bcrypt)
})

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt)
})

app.get('/giftee/select', (req, res) => {
	giftee.selectGiftee(req, res, db)
})

app.post('/giftee/set', (req, res) => {
	giftee.setGiftee(req, res, db)
})


app.listen(process.env.PORT || 4001, () => {
	console.log(`app is running on port ${process.env.PORT}`)
})