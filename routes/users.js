const express = require('express');

const userRoutes = express.Router();
const {
  getUsers, getUserById, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/user');

const {
  validateUserId,
  validateAvatar,
  validateProfile,
} = require('../utils/validation');

userRoutes.use(express.json());

userRoutes.get('/', getUsers);
userRoutes.get('/me', express.json(), getCurrentUser);
userRoutes.get('/:id', validateUserId, getUserById);
userRoutes.patch('/me', validateProfile, updateUser);
userRoutes.patch('/me/avatar', validateAvatar, updateUserAvatar);

exports.userRoutes = userRoutes;
