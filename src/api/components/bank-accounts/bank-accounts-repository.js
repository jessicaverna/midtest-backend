const { Account } = require('../../../models');

async function getAccounts(
  page_number = 1,
  page_size = 10,
  sortOptions,
  filterOptions
) {
  const skip = (page_number - 1) * page_size;
  const accounts = await Account.find(filterOptions, {
    _id: 1,
    accountNumber: 1,
    pin: 1,
    balance: 1,
  })
    .sort(sortOptions)
    .skip(skip)
    .limit(page_size);
  return accounts;
}

async function getAccountCount(filterOptions) {
  const count = await Account.countDocuments(filterOptions);
  return count;
}

async function getAccount(id) {
  return Account.findById(id);
}

async function createAccount(accountNumber, pin, balance) {
  const newAccount = new Account({ accountNumber, pin, balance });
  return newAccount.save();
}

async function updateAccount(id, accountNumber, pin, balance) {
  const updatedAccount = await Account.findByIdAndUpdate(
    id,
    { accountNumber, pin, balance },
    { new: true }
  );
  return updatedAccount;
}

async function deleteAccount(id) {
  return Account.findByIdAndDelete(id);
}

async function getAccountByNumber(accountNumber) {
  return Account.findOne({ accountNumber });
}

module.exports = {
  getAccounts,
  getAccountCount,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountByNumber,
};
