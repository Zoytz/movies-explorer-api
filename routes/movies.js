const express = require('express');

const movieRoutes = express.Router();
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movie');

const {
  validateMovieId,
  validateMovie,
} = require('../utils/validation');

movieRoutes.use(express.json());

movieRoutes.get('/', getMovies);
movieRoutes.delete('/:id', validateMovieId, deleteMovie);
movieRoutes.post('/', validateMovie, createMovie);

exports.movieRoutes = movieRoutes;
