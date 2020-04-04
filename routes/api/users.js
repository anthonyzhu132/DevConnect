const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// post api/users
// REGISTER USER
// PUBLIC access
router.post('/', [
  //Running the checks with express-validator
  check('name', 'Name is required to sign in')
    .not()
    .isEmpty(),
  check('email', 'Please enter valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .isLength({ min: 6})
], (req, res) => {
  console.log(req.body)
  res.send('user route')
})

module.exports = router;
