const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const accountsControllers = require('./bank-accounts-controller');
const accountsValidator = require('./bank-accounts-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/accounts', route);
  route.get('/', authenticationMiddleware, accountsControllers.getAccounts);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(accountsValidator.createAccount),
    accountsControllers.createAccount
  );

  route.get('/:id', authenticationMiddleware, accountsControllers.getAccount);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(accountsValidator.updateAccount),
    accountsControllers.updateAccount
  );

  route.delete(
    '/:id',
    authenticationMiddleware,
    accountsControllers.deleteAccount
  );

  route.get(
    '/number/:accountNumber',
    authenticationMiddleware,
    accountsControllers.getAccountByAccountNumber
  );
};
