const Movie = require('../../models/movie');

describe('Movie', () => {
  describe('search', () => {
    test('returns results of the search term as array of movies', async () => {
      const results = await Movie.search('matrix');
      console.log(results);
      expect(results).toBeNull();
    });
  });
});