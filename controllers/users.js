const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректны данные' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { id } = req.user._id;
  User.findByIdAndUpdate({ name, about, id })
    .then((user) => res.send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректны данные' });
      }
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
const updateUserAvatar = (req, res) => {
  const avatar = req.body;
  const { id } = req.user._id;
  User.findByIdAndUpdate(id, avatar)
    .then((user) => res.send({ data: user.avatar }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным id не найден' });
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
