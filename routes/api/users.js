const express = require('express');
const router = express.Router();


// post api/users
// REGISTER USER
// PUBLIC access
router.post('/', (req, res) => {
  console.log(req.body)
  res.send('user route')
})

module.exports = router;
