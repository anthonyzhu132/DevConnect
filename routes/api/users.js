const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../../models/user');
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
], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body; 

  try {
    let user = await User.findOne({ email });
    
    if(user) {
      res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }
    //See if the user exists
    //Get users gravatar
    //Encrypt password
    //Return JsonWebToken
     res.send('user route')
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
})

module.exports = router;
