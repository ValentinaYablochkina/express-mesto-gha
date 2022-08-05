const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = /^(https?):\/\/?(\www\.)?([a-z0-9-]+)\.([a-z0-9-]{2,6})\/?((\.?\/?[a-z0-9-_]+)*)\/?/m;

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);
module.exports = router;
