const mongoose = require('mongoose');
const config = require('../core/config');
const logger = require('../core/logger')('app');

const usersSchema = require('./users-schema');
const accountsSchema = require('./accounts-schema'); // Impor schema untuk Account

mongoose.connect(`${config.database.connection}/${config.database.name}`, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.once('open', () => {
  logger.info('Successfully connected to MongoDB');
});

const User = mongoose.model('User', mongoose.Schema(usersSchema)); // Definisikan model User
const Account = mongoose.model('Account', mongoose.Schema(accountsSchema)); // Definisikan model Account

module.exports = {
  mongoose,
  User,
  Account,
};
