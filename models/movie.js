require('dotenv').config({ 
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

const axios = require('axios').default;

class Movie {
  constructor(id, title, plot, genres, released, poster, imdbID) {
    this.id = id;
    this.title = title;
    this.plot = plot;
    this.genres = genres;
    this.released = released;
    this.poster = poster;
    this.imdbID = imdbID;
  }

  static async search(query) {
    const url = this.#buildSearchURL(query);
    const totalPages = await this.#pagesInSearch(url);

    if (totalPages === 0) { return null; }

    const movieIDs = await this.#getMovieIDs(url, totalPages);
    const movieDetails = await this.#getMovieDetails(movieIDs);
    const movies = this.#parseMovieDetails(movieDetails);
    return movies;
  }

  static async retrieveList(list) {
    const movieIDs = list.movieIDs;
    const movieDetails = await this.#getMovieDetails(movieIDs);
    const movies = this.#parseMovieDetails(movieDetails);
    return movies;
  }

  static #buildSearchURL(query) {
    const baseURL = 'https://api.themoviedb.org/3/search/movie';
    const apiKey = `?api_key=${process.env.TMDB_KEY}`;
    const lang = '&language=en-US';
    query = `&query=${query}`;
    return baseURL + apiKey + lang + query;
  }

  static async #pagesInSearch(url) {
    return await axios({ method: 'get', url: url })
      .then(res => { return res.data.total_pages; })
      .catch(err => console.log(err))
  }

  static async #getMovieIDs(url, totalPages) {
    let movieIDs = [];

    for (let i = 1; i <= totalPages; i++) {
      let page = `&page=${i}`;

      await axios({ method: 'get', url: `${url}${page}` })
        .then(res => { 
          res.data.results.forEach(movie => {
            movieIDs.push(movie.id);
          })
        })
        .catch(err => console.log(err))
    }

    return movieIDs;
  }

  static async #getMovieDetails(movieIDs) {
    const baseURL = 'https://api.themoviedb.org/3/movie/';
    const apiKey = `?api_key=${process.env.TMDB_KEY}`;
    const lang = '&language=en-US';

    const movieDetails = await Promise.all(
      movieIDs.map(async movieID => {
        return await axios({ method: 'get', url: `${baseURL}${movieID}${apiKey}${lang}` })
          .then(res => { return res.data } )
          .catch(err => { console.log('GET MOVIE DETAILS ERROR', err.request.path) })
      })
    );
    
    return movieDetails.filter(movie => movie);
  }

  static #parseMovieDetails(movieDetails) {
    return movieDetails.map(movie => {
      let poster;
      let urlTitle;

      if (movie.poster_path) {
        poster = `https://image.tmdb.org/t/p/w185${movie.poster_path}`;
      } else {
        urlTitle = movie.title.replace(/\s/g, '%20');
        poster = `https://dummyimage.com/185x280/fff/000.jpg&text=${urlTitle}`;
      }

      return new Movie(
        movie.id,
        movie.title,
        movie.overview,
        movie.genres,
        movie.release_date,
        poster,
        movie.imdb_id
      );
    });
  }
}

module.exports = Movie;