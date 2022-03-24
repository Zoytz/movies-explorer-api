const Card = require('../models/Card');
const Error404 = require('../utils/errors/Error404');
const Error500 = require('../utils/errors/Error500');
const Error400 = require('../utils/errors/Error400');
const Error403 = require('../utils/errors/Error403');

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return next(new Error500('Ошибка сервера'));
  }
};

exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new Error400('Переданы некорректные данные при создании карточки'));
    } else {
      next(new Error500('Ошибка в createCard'));
    }
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (card) {
      if (!card.owner.equals(req.user._id)) {
        next(new Error403('У Вас нет прав для удаления этой карточки'));
      } else {
        const deletedCard = await Card.findByIdAndRemove(req.params.id);
        res.status(200).send(deletedCard);
      }
    } else {
      next(new Error404('Передан несуществующий _id карточки'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new Error400('Невалидный id'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

exports.addCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(200).send(card);
    } else {
      next(new Error404('Передан несуществующий _id карточки'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new Error400('Невалидный id'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

exports.deleteCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res.status(200).send(card);
    } else {
      next(new Error404('Передан несуществующий _id карточки'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new Error400('Невалидный id'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};
