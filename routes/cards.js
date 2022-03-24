const express = require('express');

const cardsRoutes = express.Router();
const {
  getCards, deleteCard, createCard, addCardLike, deleteCardLike,
} = require('../controllers/card');

const {
  validateCardId,
  validateCard,
} = require('../utils/validation');

cardsRoutes.use(express.json());

cardsRoutes.get('/', getCards);
cardsRoutes.delete('/:id', validateCardId, deleteCard);
cardsRoutes.post('/', validateCard, createCard);
cardsRoutes.put('/:id/likes', validateCardId, addCardLike);
cardsRoutes.delete('/:id/likes', validateCardId, deleteCardLike);

exports.cardsRoutes = cardsRoutes;
