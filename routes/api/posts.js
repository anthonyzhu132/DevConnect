const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/post');
const Profile = require('../../models/profile');
const User = require('../../models/user');

// POST api/posts
// Create a post
// Private
router.post('/', [ auth, [
  check('text', 'Text is required').not().isEmpty()
] ],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id.select('-password'));

  const newPost = {
     text: req.body.text,
     name: user.name,
     avatar: user.avatar,
     user: req.user.id
  }

})

module.exports = router;
