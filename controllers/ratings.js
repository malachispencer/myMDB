const Rating = require('../models/rating');

module.exports ={
  create: async (req, res, next) => {
    const { movieID, score } = req.validated.body;
    const newRating = await Rating.create(req.user.userID, movieID, score);
    res.status(200).json({ message: 'Rating created', newRating });
  }
}