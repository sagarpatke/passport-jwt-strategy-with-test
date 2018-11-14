const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const apiRoute = jsonServer.router(path.resolve(__dirname, 'db.json'));
const jsonServerMiddleware = jsonServer.defaults();
const bodyParser = require('body-parser');
const generateJwtToken = require('./generateJwtToken');

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
    audience: 'my-app.example.com',
    issuer: 'my-app.example.com',
    secretOrKey: 'secret',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const users = {
    admin: {
        "name": "Super Admin",
        "email": "admin@example.com"
    }
};

passport.use(new JwtStrategy(opts, (payload, done) => {
    const username = payload.sub;
    // TODO: Retrieve the User object from database
    if(users[username]) {
        done(null, users[username]);
    } else {
        done(null, false);
    }
}));

const app = express();
app.use('/api', jsonServerMiddleware);
app.use('/api', passport.authenticate('jwt', { session: false }), apiRoute);

app.use(bodyParser.json());
app.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username === 'admin' && password === 'my-secret-pass') {
        res.json({token: generateJwtToken(opts, 'admin')});
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
});

module.exports = app;