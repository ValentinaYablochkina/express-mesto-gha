const jwt = require('jsonwebtoken');
const TokenErr = require('../errors/err-401');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new TokenErr('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
