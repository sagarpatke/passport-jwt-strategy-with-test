const generateJwtToken = require('./generateJwtToken');

const token = generateJwtToken({
    audience: 'my-app.example.com',
    issuer: 'my-app.example.com',
    secretOrKey: 'secret',
}, 'admin');

console.log(token);