const { signToken } = require('../utils/jwt');

module.exports = {
  signIn: async (req, res, next) => {
    const token = signToken(req.user.userID);
    res.status(200).json({ token });
  }
}