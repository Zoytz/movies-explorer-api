const express = require('express');

const routes = express.Router();
const { userRoutes } = require('./users');
const { login, createUser } = require('../controllers/user');
const { movieRoutes } = require('./movies');
const auth = require('../middlewares/auth');
const { validateUser, validateNewUser } = require('../utils/validation');
const Error404 = require('../utils/errors/Error404');

routes.use(express.json());

routes.use('/users', auth, userRoutes);
routes.use('/movies', auth, movieRoutes);
routes.post('/signin', validateUser, login);
routes.post('/signup', validateNewUser, createUser);
routes.use('*', auth, (req, res, next) => {
  next(new Error404('Нет такой страницы'));
});

exports.routes = routes;
