const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.post('/verifyToken', async (req, res) => {
  const token = req.body.authtoken

  if (!token) return res.status(401).send('Access Denied')

  try {
      jwt.verify(token, process.env.TOKEN_SECRET);
      res.status(200).send("Success")
  } catch(err) {
      res.status(400).send('Invalid token')
  }
});

module.exports = router;
