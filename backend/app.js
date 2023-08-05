require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const NotFoundError = require('./errors/NotFoundError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const routeSignup = require('./routes/index');
const routeSignin = require('./routes/index');

const auth = require('./middlewares/auth');
const limiter = require('./middlewares/limiter');

const error = require('./middlewares/error');

const URL = 'mongodb://127.0.0.1:27017/mestodb';

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect(URL)
  .then(() => {
    console.log('БД успешно подключена');
  })
  .catch(() => {
    console.log('Не удалось подключиться к БД');
  });

const app = express();

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(helmet());
app.use(auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.use(requestLogger); // подключаем логгер запросов

app.use('/', routeSignup);
app.use('/', routeSignin);
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));
app.use(error);

app.listen(PORT);
