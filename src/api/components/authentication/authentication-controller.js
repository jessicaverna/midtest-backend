const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

const loginAttempts = {};

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const currentTime = new Date();
    const lastAttempt = loginAttempts[email];

    if (lastAttempt && lastAttempt.attempts >= 5) {
      const lastAttemptTime = lastAttempt.lastAttemptTime;
      const thirtyMinutesInMillis = 30 * 60 * 1000;
      const timeDifference = currentTime - lastAttemptTime;

      if (timeDifference < thirtyMinutesInMillis) {
        const nextAttemptTime = new Date(
          lastAttemptTime.getTime() + thirtyMinutesInMillis
        );
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts',
          `You have exceeded the maximum number of login attempts. Please try again after ${nextAttemptTime}`
        );
      } else {
        loginAttempts[email].attempts = 0;
      }
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      if (!lastAttempt) {
        loginAttempts[email] = { lastAttemptTime: currentTime, attempts: 1 };
      } else {
        loginAttempts[email].attempts++;
      }

      if (loginAttempts[email].attempts > 5) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts',
          'You have exceeded the maximum number of login attempts. Please try again later.'
        );
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    if (loginAttempts[email]) {
      delete loginAttempts[email];
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
