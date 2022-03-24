const jwt = require('jsonwebtoken');
const Error401 = require('../utils/errors/Error401');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Error401('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new Error401('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
