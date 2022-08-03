const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

router.use('/', userRouter);
router.use('/cards', auth, cardRouter);
router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
