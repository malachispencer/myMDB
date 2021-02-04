const testDB = require('../testDB');
const Movie = require('../../models/movie');
const tmdbResponse = require('../../__fixtures__/tmdbResponse');
const mockAxios = require('axios');

jest.mock('axios');

beforeEach(async () => {
  await testDB.clean();
});

afterAll(async () => {
  await testDB.close();
});

describe('Movie', () => {
  describe('search', () => {
    test('returns results of the search term as array of movies', async () => {
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.totalPages);
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieIDs);
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieOneDetails);
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieTwoDetails);

      const results = await Movie.search('matrix');
      const randIndex = Math.floor(Math.random() * results.length);

      expect(results.length).toBe(2);
      expect(results).toBeInstanceOf(Array);
      expect(results[randIndex]).toBeInstanceOf(Movie);
      expect(results[0].id).toBe(tmdbResponse.movieOneDetails.data.id);
      expect(results[0].title).toBe(tmdbResponse.movieOneDetails.data.title);
      expect(results[1].plot).toBe(tmdbResponse.movieTwoDetails.data.overview);
      expect(results[1].genres).toEqual(tmdbResponse.movieTwoDetails.data.genres);
    });
  });
});