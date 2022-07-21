const User = require("../models/user");
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: "Произошла ошибка" }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Запрашиваемый пользователь не найден" });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректны данные" });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

const updateUserProfile = (req, res) => {
  const name = req.body;
  const { id } = req.user._id;
  User.findByIdAndUpdate(id, name)
    .then((user) => res.send({ data: user.name }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректны данные" });
      }
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным id не найден" });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};
const updateUserAvatar = (req, res) => {
  const avatar = req.body;
  const { id } = req.user._id;
  User.findByIdAndUpdate(id, avatar)
    .then((user) => res.send({ data: user.avatar }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: "Переданы некорректны данные" });
      }
      if (err.name === "CastError") {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным id не найден" });
      }
      res.status(500).send({ message: "Произошла ошибка" });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserAvatar,
  updateUserProfile,
};
