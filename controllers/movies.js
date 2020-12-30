const Movie = require('../models/movie');

module.exports = {
  getSearchResults: async (req, res, next) => {
    const { query } = req.params;
    const results = await Movie.search(query);
    res.status(200).json(results);
  },

  findMovie: async (req, res, next) => {
    const { movie_id } = req.params;
    const foundMovie = await Movie.findByID(movie_id);
    res.status(200).json(foundMovie);
  }
}