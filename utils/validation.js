const { celebrate, Joi } = require('celebrate');

const validateUserId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/[-a-zA-Z0-9@:%_.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&=]*)?/),
    trailerLink: Joi.string().required().pattern(/[-a-zA-Z0-9@:%_.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&=]*)?/),
    thumbnail: Joi.string().required().pattern(/[-a-zA-Z0-9@:%_.~#?&=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&=]*)?/),
    movieId: Joi.string().required(),
  }),
});

const validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
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
};
