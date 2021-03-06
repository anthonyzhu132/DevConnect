const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const request = require('request');
const config = require('config');

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

    //setting all profile fields from req.body onto profileFields object
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
      profileFields.skills = skills.split(', ').map(skill => skill.trim());
    }

    //Building social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      if(profile) {
        //Updating the profile once it's been found
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Creating profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error')
    }

})

// GET api/profile
// GET all profiles
// Public
router.get('/', async (req, res) => {
 try {
   const profiles = await Profile.find().populate('user', ['name', 'avatar']);
   res.json(profiles);
 } catch (err) {
   console.error(err.message);
   res.status(500).send('Sever Error')
 } 

});

// GET api/profile/user/:user_id
// GET Profile by user_id
// Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// DELETE api/profile 
// DELETE profile, user & posts
// Private
router.delete('/', auth, async (req, res) => {
  try {

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT api/profile/experience
// Add profile experience
// Private
router.put('/experience', [ auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty(),
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    //Setting profile from the request token
    const profile = await Profile.findOne({ user: req.user.id });

    //pushing new experiences into experiences array
    profile.experience.push(newExp);

    //Saving new profile
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server Error')
  }
});

// DELETE api/profile/experience/:exp_id
// Delete experience from profile
// Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    //Setting profile from the request token
    const profile = await Profile.findOne({ user: req.user.id });

    //Getting remove index
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
    
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server Error')
  }
})

// PUT api/profile/education
// Add profile education
// Private
router.put('/education', [ auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
] ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }

  try {
    //Setting profile from the request token 
    const profile = await Profile.findOne({ user: req.user.id });

    //pushing new experiences into experiences array
    profile.education.push(newEdu);

    //Saving new profile
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server Error')
  }
});

// DELETE api/profile/education/:edu_id
// Delete education from profile
// Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    //Setting profile from the request token
    const profile = await Profile.findOne({ user: req.user.id });

    //Getting remove index
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
    
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send('Server Error')
  }
})


// GET api/profile/github/:username
// Get user repos from github
// Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) =>{
      if(error) console.error(error);

      if(response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' })
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})


module.exports = router;