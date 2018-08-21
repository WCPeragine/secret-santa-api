const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();


app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
	res.send("It's working");
})


app.listen(process.env.PORT || 4001, () => {
	console.log(`app is running on port ${process.env.PORT}`)
})