const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const Error400 = require('./errors/Error400');

const validationURL = (URL) => {
  if (!validator.isURL(URL)) {
    throw new Error400('Некорректный url');
  }
  return URL;
};

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validationURL),
    trailerLink: Joi.string().required().custom(validationURL),
    thumbnail: Joi.string().required().custom(validationURL),
    movieId: Joi.number().required(),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUserId,
  validateProfile,
  validateMovieId,
  validateMovie,
  validateUser,
  validateNewUser,
};
