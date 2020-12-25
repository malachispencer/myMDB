const User = require('../models/user');

module.exports = {
  signUp: async (req, res, next) => {
    const { username, password } = req.validated.body;
    const email = req.validated.body.email.toLowerCase();
    const foundUser = await User.findByEmail(email);

    if (foundUser) { 
      return res.status(403).json({ error: 'Email already registered' });
    }

    const newUser = await User.create(username, email, password);
  }
}