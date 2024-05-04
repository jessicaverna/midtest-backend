const joi = require('joi');

module.exports = {
  createAccount: {
    body: {
      accountNumber: joi.string().required().label('Account Number'),
      pin: joi.number().integer().required().label('PIN'),
      balance: joi.number().min(0).required().label('Balance'),
    },
  },

  updateAccount: {
    body: {
      accountNumber: joi.string().required().label('Account Number'),
      pin: joi.number().integer().required().label('PIN'),
      balance: joi.number().min(0).required().label('Balance'),
    },
  },
};
