const { errorResponder, errorTypes } = require('../../../core/errors');
const bankAccountService = require('./bank-accounts-service');

async function getAccounts(request, response, next) {
  try {
    const { page_number = 1, page_size = 10, sort, search } = request.query;
    const queryParams = { page_number, page_size, sort, search };
    const result = await bankAccountService.getAccounts(queryParams);
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function createAccount(request, response, next) {
  try {
    const { accountNumber, pin, balance } = request.body;
    const account = await bankAccountService.createAccount(
      accountNumber,
      pin,
      balance
    );
    return response.status(201).json(account);
  } catch (error) {
    return next(error);
  }
}

async function getAccount(request, response, next) {
  try {
    const accountId = request.params.id;
    const account = await bankAccountService.getAccount(accountId);
    if (!account) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
    }
    return response.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}

async function updateAccount(request, response, next) {
  try {
    const accountId = request.params.id;
    const {
      accountNumber: newAccountNumber,
      pin: newPin,
      balance: newBalance,
    } = request.body;

    const existingAccount = await bankAccountService.getAccount(accountId);
    if (!existingAccount) {
      return response
        .status(404)
        .json({ message: `Bank account with ID ${accountId} not found` });
    }

    const {
      accountNumber: oldAccountNumber,
      pin: oldPin,
      balance: oldBalance,
    } = existingAccount;

    const updatedAccount = await bankAccountService.updateAccount(
      accountId,
      newAccountNumber,
      newPin,
      newBalance
    );

    if (updatedAccount) {
      let message = `Bank account with accountNumber ${newAccountNumber} successfully updated`;

      if (oldAccountNumber !== newAccountNumber) {
        message += ` (AccountNumber changed from ${oldAccountNumber} to ${newAccountNumber})`;
      }

      if (oldPin !== newPin) {
        message += ` (Pin changed from ${oldPin} to ${newPin})`;
      }

      if (oldBalance !== newBalance) {
        if (newBalance > oldBalance) {
          message += ` (Balance increased from ${oldBalance} to ${newBalance})`;
        } else {
          message += ` (Balance decreased from ${oldBalance} to ${newBalance})`;
        }
      }

      return response.status(200).json({ message });
    } else {
      return response.status(404).json({
        message: `Failed to update bank account with ID ${accountId}`,
      });
    }
  } catch (error) {
    return next(error);
  }
}

async function deleteAccount(request, response, next) {
  try {
    const accountId = request.params.id;
    await bankAccountService.deleteAccount(accountId);
    return response
      .status(200)
      .json({ message: 'Account successfully deleted' });
  } catch (error) {
    return next(error);
  }
}

async function getAccountByAccountNumber(request, response, next) {
  try {
    const accountNumber = request.params.accountNumber;
    const account =
      await bankAccountService.getAccountByAccountNumber(accountNumber);
    if (!account) {
      throw errorResponder(errorTypes.NOT_FOUND, 'Account not found');
    }
    return response.status(200).json(account);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAccounts,
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  getAccountByAccountNumber,
};
