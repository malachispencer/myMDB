const testDB = require('../testDB');
const Movie = require('../../models/movie');
const tmdbResponse = require('../../__fixtures__/tmdbResponse');
const movieList = require('../../__fixtures__/movieList');
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

    test('returns null if no results are found from the API', async () => {
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.zeroTotalPages);

      const nonExistentMovie = 'abcdefghijklmnopqrstuvwxyz';
      const result = await Movie.search(nonExistentMovie);
      
      expect(result).toBeNull();
    });
  });

  describe('retrieveList', () => {
    test('takes a list of movieIDs and returns the movies', async () => {
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieOneDetails);
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieTwoDetails);

      const movies = await Movie.retrieveList(movieList.listObject);

      expect(movies.length).toBe(2);
      expect(movies[0].title).toBe(tmdbResponse.movieOneDetails.data.title);
      expect(movies[1].title).toBe(tmdbResponse.movieTwoDetails.data.title);
    });
  });

  describe('findByID', () => {
    test('given a TMDb ID, returns the movie', async () => {
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.movieOneDetails);

      const theMatrixTMDbID = 603;
      const result = await Movie.findByID(theMatrixTMDbID);

      expect(result).toBeInstanceOf(Movie);
      expect(result.id).toBe(tmdbResponse.movieOneDetails.data.id);
      expect(result.title).toBe(tmdbResponse.movieOneDetails.data.title);
    });

    test('returns null if no movie with the given ID is found', async () => {
      mockAxios.get.mockResolvedValueOnce(tmdbResponse.noMovieFound);

      const invalidTMDbID = 1;
      const result = await Movie.findByID(invalidTMDbID);

      expect(result).toBeNull();
    });
  });
});