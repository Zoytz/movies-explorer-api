const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Error404 = require('../utils/errors/Error404');
const Error500 = require('../utils/errors/Error500');
const Error409 = require('../utils/errors/Error409');
// const Error400 = require('../utils/errors/Error400');
const Error401 = require('../utils/errors/Error401');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(() => {
      next(new Error500('Ошибка сервера'));
    });
};

exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then(() => res.status(201).send({
            data: {
              name, email,
            },
          }))
          .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
              next(new Error409('Пользователь уже существует'));
            } else {
              next(new Error500('Ошибка сервера'));
            }
          });
      } else {
        next(new Error409('Пользователь уже существует'));
      }
    })
    .catch(() => {
      next(new Error500('Ошибка сервера'));
    });
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      next(new Error404('Пользователь с указанным _id не найден'));
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new Error409('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ jwt: token });
    })
    .catch(() => {
      next(new Error401('Неверная почта или пароль'));
    });
};
