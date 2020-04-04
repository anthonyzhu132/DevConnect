const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

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
    
    //See if the user exists
    if(user) {
      res.status(400).json({ errors: [{ msg: 'User already exists' }] })
    }

    //Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    //Replacing old user information with new user information (NOT SAVING YET)
    user = new User({
      name,
      email,
      avatar,
      password
    });

    //Encrypt password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);

    //User is being saved with new information and encrypted passowrd
    user.save()

    //Return JsonWebToken
     const payload = {
       user: {
         id: user.id
       }
     }

     jwt.sign(
       payload,
       config.get('jwtSecret'),
       { expiresIn: 360000 },
       (err, token) => {
         if(err) throw err;
         res.json({ token });
       })

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error')
  }
})

module.exports = router;
