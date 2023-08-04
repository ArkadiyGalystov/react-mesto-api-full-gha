const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const doublingError = require('../errors/ConflictError'); //!//
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { SECRET_KEY } = require('../utils/constants');

// Получить всех пользователей GET запросом
module.exports.usersDate = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

// Получить всех пользователей по id
module.exports.userById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)

    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователя по указанному id не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Регистрация нового пользователя
module.exports.createUser = (req, res, next) => {
  const {email, password, name, about, avatar,} = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const { _id } = user;

      return res.status(201).send({
        email,
        name,
        about,
        avatar,
        _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new doublingError(
            'Email адрес уже зарегистрирован',
          ),
        );
      } else if (err.name === 'ValidationError') {
        next(
          new BadRequestError(
            'Переданы некорректные данные пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

// Обновление данных пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователя по указанному id не существует');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Неверно указанны данные для обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

// Обновиление аватара пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.user;

  User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ user });

      throw new NotFoundError('Пользователя по указанному id не существует');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(
          new BadRequestError(
            'Неверно указанны данные для обновлении профиля',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' });

        return res.send({ _id: token });
      }

      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
}