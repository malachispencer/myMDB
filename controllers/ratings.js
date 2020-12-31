const Rating = require('../models/rating');

module.exports ={
  create: async (req, res, next) => {
    const { movieID, score } = req.validated.body;
    const newRating = await Rating.create(req.user.userID, movieID, score);
    res.status(200).json({ message: 'Rating created', newRating });
  },

  update: async (req, res, next) => {
    const { ratingID, newScore } = req.validated.body;
    const updatedRating = await Rating.update(ratingID, newScore);
    res.status(200).json({ message: 'Rating updated', updatedRating });
  },

  delete: async (req, res, next) => {
    const { ratingID } = req.params;
    await Rating.delete(ratingID);
    res.status(200).json({ message: `Rating with ID ${ratingID} deleted`});
  }
}