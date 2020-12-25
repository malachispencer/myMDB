module.exports = {
  signUp: async (req, res, next) => {
    console.log('SUCCESS', req.validated.body);
  }
}