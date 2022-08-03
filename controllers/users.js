const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

const SALT_ROUNDS = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ user });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((data) => {
      if (data) {
        res.status(409).send({ message: 'Такой пользователь существует' });
      }
      bcrypt.hash(password, SALT_ROUNDS)
        .then((hash) => {
          User.create({ email, password: hash })
            .then((user) => {
              res.status(201).send({
                name: user.name,
                about: user.about,
                avatar: user.avatar,
                email: user.email,
              });
            })
            .catch(next);
        })
        .catch(next);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const updateUserProfile = (req, res, next) => {
  User.findOneAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ user });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  User.findOneAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден.');
      }
      return res.send({ user });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserAvatar,
  updateUserProfile,
  login,
};
