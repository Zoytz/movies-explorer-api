const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Error404 = require('../utils/errors/Error404');
const Error500 = require('../utils/errors/Error500');
const Error409 = require('../utils/errors/Error409');
const Error400 = require('../utils/errors/Error400');
const Error401 = require('../utils/errors/Error401');

exports.getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      next(new Error500('Ошибка сервера'));
    });
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new Error404('Пользователь не найден'));
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new Error404('Пользователь не найден'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

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
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            about,
            avatar,
            email,
            password: hash,
          }))
          .then(() => res.status(201).send({
            data: {
              name, about, avatar, email,
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
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      next(new Error404('Пользователь с указанным _id не найден'));
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new Error400('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      next(new Error400('Переданы некорректные данные при обновлении аватара'));
    }
    const userWithUpdatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!userWithUpdatedAvatar) {
      next(new Error404('Пользователь с указанным _id не найден'));
    } else {
      res.status(200).send(userWithUpdatedAvatar);
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new Error400('Переданы некорректные данные при обновлении аватара'));
    } else {
      next(new Error500('Ошибка сервера'));
    }
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ jwt: token });
    })
    .catch(() => {
      next(new Error401('Неверная почта или пароль'));
    });
};
