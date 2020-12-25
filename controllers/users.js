const User = require('../models/user');
const { signToken } = require('../utils/jwt');

module.exports = {
  signUp: async (req, res, next) => {
    const { username, password, email } = req.validated.body;
    const foundUser = await User.findByEmail(email);

    if (foundUser) { 
      return res.status(403).json({ error: 'Email already registered' });
    }

    const newUser = await User.create(username, email, password);
    const token = signToken(newUser.userID);
    res.status(200).json({ token });
  }
}