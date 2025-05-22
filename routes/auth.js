const express = require('express');
const router = express.Router();


const USER = {
  username: 'admin',
  password: 'admin'
};

const MOCK_TOKEN = 'mocked-jwt-token-123456';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username });

  if (username === USER.username && password === USER.password) {
    return res.status(200).json({
      message: 'Login successful',
      token: MOCK_TOKEN,
      username: USER.username
    });
  }

  return res.status(401).json({ message: 'Invalid username or password' });
});

module.exports = router;
