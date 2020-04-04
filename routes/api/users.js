const express = require('express');
const router = express.Router();


// GET api/users
// PUBLIC access
router.get('/', (req, res) => {
  res.send('user route')
})

module.exports = router;
