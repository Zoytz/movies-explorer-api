const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

const app = express();
const { PORT = 3000 } = process.env;
const { routes } = require('./routes/index');

app.use(cors());
app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Ошибка сервера' } = err;
  res.status(statusCode).send({ message });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await app.listen(PORT);
}
main();
