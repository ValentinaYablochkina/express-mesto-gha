const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const AuthorizedButForbidden = require('../errors/err-403');

const getCards = (req, res) => {
  Card.find({}).then((cards) => res.send(cards));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ card }))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      // eslint-disable-next-line eqeqeq
      if (card.owner != req.user._id) {
        throw new AuthorizedButForbidden('Нарушение прав доступа');
      } else {
        card.remove()
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          });
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий id карточки');
      }
      return res.status(200).send({ card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий id карточки');
      }
      return res.status(200).send({ card });
    })
    .catch(next);
};
module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
