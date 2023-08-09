var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
var User = require('../models/Users');

app.use(bodyParser.json());
const SECRET_KEY = 'yourSecretKey';

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/check-availability', (req, res) => {
  const { username, email } = req.body;

  User.findOne({ $or: [{ username }, { email }] }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred.' });
    }

    if (user) {
      return res.json({ available: false }); // User already exists
    } else {
      return res.json({ available: true }); // User is available
    }
  });
});

router.post('/check-user-exists', (req, res) => {

  console.log("ïnside router for user exist", req)
  const { username } = req.body;
  console.log("username - ", username)
  User.findOne({ username }, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred.' });
    }

    if (user) {
      console.log("user - ", user)
      return res.json({ exists: true });
    } else {
      console.log("inside else block - ")
      return res.json({ exists: false });
    }
  });
});

module.exports = router;
