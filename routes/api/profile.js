const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/profile'); 
const User = require('../../models/user');

// GET api/profile/me
// GET current user's profile
// Private gateway for specific user
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

// POST api/profile
// Create or update a user profile
// Private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
] ],
  async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    //Pulling all of the fields from request body

    const {
      company,
      website, 
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object from the request body
    const profileFields = {};

    //setting user with request bodies user ID
    profileFields.user = req.user.id;

    
     
})

module.exports = router;
