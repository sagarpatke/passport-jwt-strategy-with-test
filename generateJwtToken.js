const jwt = require('jsonwebtoken');

module.exports = function generateJwtToken({audience, issuer, secretOrKey}, subject) {
    return jwt.sign({}, secretOrKey, {audience, issuer, expiresIn: '10d', subject});
};