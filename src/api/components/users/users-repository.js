const { User } = require('../../../models');

async function getUsers() {
  return User.find({});
}

async function getUser(id) {
  return User.findById(id);
}

async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

async function getUserByEmail(email) {
  return User.findOne({ email });
}

async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
