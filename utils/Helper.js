require('dotenv').config();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Define = require('./Define');

const Helper = {
    getJWTtoken: (email) => {
        var expires = moment().add(1, Define.DAYS).valueOf();
        return jwt.sign({ email: email }, process.env.ACCESS_SECRET, { expiresIn: expires });
    }
}
module.exports = Helper