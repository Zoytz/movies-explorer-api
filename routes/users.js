const express = require('express');

const userRoutes = express.Router();
const { updateUser, getCurrentUser } = require('../controllers/user');

const {
  validateProfile,
  validateUserId,
} = require('../utils/validation');

userRoutes.use(express.json());

userRoutes.get('/me', validateUserId, getCurrentUser);
userRoutes.patch('/me', validateProfile, updateUser);

exports.userRoutes = userRoutes;
