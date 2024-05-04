const bankAccountRepository = require('./bank-accounts-repository');

async function getAccounts(queryParams) {
  const { page_number, page_size, sort, search } = queryParams;

  let filterOptions = {};

  if (search) {
    const [field, value] = search.split(':');
    if (field.trim() === 'accountNumber') {
      const regexValue = new RegExp(value.trim(), 'i');
      filterOptions.accountNumber = { $regex: regexValue };
    }
  }

  const sortOptions = {};
  if (sort) {
    const [sortField, sortOrder] = sort.split(':');
    sortOptions[sortField] =
      sortOrder === 'asc' ? 1 : sortOrder === 'desc' ? -1 : 0;
  }

  const accounts = await bankAccountRepository.getAccounts(
    parseInt(page_number),
    parseInt(page_size),
    sortOptions, // Pass sortOptions to enable sorting
    filterOptions
  );

  const count = await bankAccountRepository.getAccountCount(filterOptions);

  const total_pages = Math.ceil(count / parseInt(page_size));
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  const formattedAccounts = formatAccounts(accounts);

  return {
    page_number: parseInt(page_number),
    page_size: parseInt(page_size),
    count,
    total_pages,
    has_previous_page,
    has_next_page,
    data: formattedAccounts,
  };
}

async function getAccount(id) {
  const account = await bankAccountRepository.getAccount(id);
  return formatAccount(account);
}

async function createAccount(accountNumber, pin, balance) {
  const newAccount = await bankAccountRepository.createAccount(
    accountNumber,
    pin,
    balance
  );
  return formatAccount(newAccount);
}

async function updateAccount(id, accountNumber, pin, balance) {
  const updatedAccount = await bankAccountRepository.updateAccount(
    id,
    accountNumber,
    pin,
    balance
  );
  return formatAccount(updatedAccount);
}

async function deleteAccount(id) {
  await bankAccountRepository.deleteAccount(id);
}

async function getAccountByAccountNumber(accountNumber) {
  return bankAccountRepository.getAccountByNumber(accountNumber);
}

function formatAccounts(accounts) {
  return accounts.map((account) => formatAccount(account));
}

function formatAccount(account) {
  if (!account) {
    return null;
  }
  return {
    id: account._id,
    accountNumber: account.accountNumber,
    pin: account.pin,
    balance: account.balance,
  };
}

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountByAccountNumber,
};
