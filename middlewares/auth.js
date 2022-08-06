const jwt = require('jsonwebtoken');
const TokenErr = require('../errors/err-401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new TokenErr('Необходима авторизация'));
    } else {
      next(err);
    }
  }

  req.user = payload;

  next();
};
