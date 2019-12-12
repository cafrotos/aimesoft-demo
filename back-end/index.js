require('dotenv').config()

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const { users } = require('./models');

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', express.static(__dirname + "/../front-end/build"));
app.use('/address', express.static(__dirname + "/../front-end/build"));
app.use('/login', express.static(__dirname + "/../front-end/build"));

app.get('/me', (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.replace('Bearer ', "");
    try {
      const payload = jwt.verify(token, process.env.access_token_private_key);
      return res.json(payload)
    } catch (error) {
      return res.status(401).json({ message: "Forbidden" })
    }
  }
  return res.status(401).json({ message: "Forbidden" })
})

app.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  users.findOne({
    where: {
      username
    }
  }).then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      const exp = Math.floor(Date.now() / 1000) + (60 * 60);
      const token = jwt.sign({ uid: user.id, username, exp }, process.env.access_token_private_key);
      return res.json({
        username,
        token,
        exp: new Date(exp * 1000)
      })
    }
    return res.status(401).json({ message: "username or password not match!" })
  }).catch(err => {
    console.log(err)
    res.status(500).send("Server interval")
  })
})

app.post('/register', (req, res, next) => {
  const { username, password } = req.body;
  users.create({
    username,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync())
  }).then(user => {
    res.json({ id: user.id, username: user.username });
  }).catch(err => {
    console.log(err)
    res.status(500).send("Server interval")
  })
})

app.listen(process.env.PORT || 3000);