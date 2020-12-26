module.exports = {
  showWatchlist: async (req, res, next) => {
    res.status(200).json(req.user);
    console.log('GOT TO THE CONTROLLER', req.user);
  }
}