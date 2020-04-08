const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/profile'); 
const User = require('../../models/user');

// GET api/profile/me
// GET current user's profile
// Prrivate gateway for specific user
router.get('/me', auth, async (req, res) => {
  try {
    //Set the profile to the user id that comes in when the GET request is made with the token
    const profile = await Profile.findOne({ user: req.user.id }).populate('user',
    ['name', 'avatar']);

    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for selected user'})
    }

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})

module.exports = router;
