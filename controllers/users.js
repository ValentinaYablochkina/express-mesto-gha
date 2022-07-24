const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Введены некорректные данные' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = (req, res) => {
  // eslint-disable-next-line max-len
  User.findOneAndUpdate(req.user._id, { name: req.body.name, about: req.body.about }, { runValidators: true, new: true })
    .then((user) => res.send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
const updateUserAvatar = (req, res) => {
  // eslint-disable-next-line max-len
  User.findOneAndUpdate(req.user._id, { avatar: req.body.avatar }, { runValidators: true, new: true })
    .then((user) => res.send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
};
