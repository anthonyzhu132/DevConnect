const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/user');

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

module.exports = router;
