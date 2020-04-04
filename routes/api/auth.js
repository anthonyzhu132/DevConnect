const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// GET api/auth
// PUBLIC access
router.get('/', auth, async (req, res) => {
  try { 
    //Find user by ID that was set by the middleware, sleect everything minus the password
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error, please check')
  }

})


// post api/auth
// Authticate user and get token
// PUBLIC access

router.post('/', [
  //Running the checks with express-validator
  check('email', 'Please enter valid email').isEmail(),
  check('password', 'Password is required')
    .exists()
  ], async (req, res) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body; 

  try {
    let user = await User.findOne({ email });
  
    if(!user) {
      res.status(400).json({ errors: [{ msg: 'Either username or password is incorrect.' }] })
    }

    //Comparing password that was gotten during sign-in with password in database
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      res.status(400).json({ errors: [{ msg: 'Either username or password is incorrect.' }] })
    }

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
