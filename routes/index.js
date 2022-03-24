const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { login, createUser } = require('../controllers/user');
const { cardsRoutes } = require('./cards');
const auth = require('../middlewares/auth');
const { validateUser } = require('../utils/validation');
const Error404 = require('../utils/errors/Error404');

routes.use(express.json());

routes.use('/users', auth, userRoutes);
routes.use('/cards', auth, cardsRoutes);
routes.post('/signin', validateUser, login);
routes.post('/signup', validateUser, createUser);
routes.use('*', auth, (req, res, next) => {
  next(new Error404('Нет такой страницы'));
});

exports.routes = routes;
