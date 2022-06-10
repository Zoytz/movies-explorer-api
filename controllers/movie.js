const Movie = require('../models/Movie');
const Error404 = require('../utils/errors/Error404');
const Error500 = require('../utils/errors/Error500');
const Error400 = require('../utils/errors/Error400');
const Error403 = require('../utils/errors/Error403');

exports.getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movie.find({ owner });
    return res.status(200).send(movies);
  } catch (err) {
    return next(new Error500('Ошибка сервера'));
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const {
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      nameRU,
      nameEN,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      owner: req.user._id,
    });
    res.status(201).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new Error400('Переданы некорректные данные при создании фильма', err));
    } else {
      next(new Error500('Ошибка в createMovie'));
    }
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      if (!movie.owner.equals(req.user._id)) {
        next(new Error403('У Вас нет прав для удаления фильма'));
      } else {
        const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
        res.status(200).send(deletedMovie);
      }
    } else {
      next(new Error404('Передан несуществующий _id фильма'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new Error400('Невалидный id'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};
