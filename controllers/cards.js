const Card = require('../models/card');
const getCards = (req, res) => {
  Card.find({})
  .then((cards) => res.send(cards));
}

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner  = req.user._id;
  Card.create({ name, link, owner })
    .then(card=> res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректны данные' })
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Карточка с указанным id не найдена' })
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  })
}

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    res.send(card)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректны данные для постановки лайка' })
    }
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Передан несуществующий id карточки' })
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  })
}

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    res.send(card)
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректны данные для снятия лайка' })
    }
    if (err.name === 'CastError') {
      return res.status(404).send({ message: 'Передан несуществующий id карточки' })
    }
    res.status(500).send({ message: 'Произошла ошибка' })
  })
}
module.exports = {getCards, createCard, deleteCard, likeCard, dislikeCard}