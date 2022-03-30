const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');
const centralErrorHandler = require('./middlewares/centralErrorHandler');

const { MONGODB = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();
const { PORT = 3000 } = process.env;
const { routes } = require('./routes/index');

app.use(cors());
app.use(requestLogger);
app.use('/', routes);
app.use(errorLogger);
app.use(errors());
app.use(centralErrorHandler);

async function main() {
  await mongoose.connect(`${MONGODB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await app.listen(PORT);
}
main();
