const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

async function getUsers(
  pageNumber = 1,
  pageSize = null,
  sortField = 'email',
  sortOrder = 'asc',
  searchParam = null
) {
  try {
    let allUsers = await usersRepository.getUsers();

    if (searchParam) {
      const [searchField, searchKey] = searchParam.split(':');
      const searchRegex = new RegExp(searchKey, 'i');

      allUsers = allUsers.filter((user) => {
        return user[searchField].match(searchRegex);
      });
    }

    allUsers.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (sortOrder === 'asc') {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

    const totalCount = allUsers.length;
    if (!pageSize && totalCount > 0) {
      pageSize = totalCount;
    } else if (!pageSize) {
      pageSize = 10;
    }

    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const usersForPage = allUsers.slice(startIndex, endIndex);

    const formattedUsers = usersForPage.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    const paginationInfo = {
      page_number: pageNumber,
      page_size: pageSize,
      count: totalCount,
      total_pages: totalPages,
      has_previous_page: pageNumber > 1,
      has_next_page: pageNumber < totalPages,
      data: formattedUsers,
    };

    return paginationInfo;
  } catch (error) {
    throw new Error('Failed to fetch users. ' + error.message);
  }
}

async function getUser(id) {
  const user = await usersRepository.getUser(id);
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

async function createUser(name, email, password) {
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteUser(id) {
  const user = await usersRepository.getUser(id);
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
