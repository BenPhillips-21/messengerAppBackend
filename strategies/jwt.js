const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
require('dotenv').config();
opts.secretOrKey = process.env.secret

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    if (jwt_payload.username) {
        return done(null, true)
    }
    return done(null, false)
}) 