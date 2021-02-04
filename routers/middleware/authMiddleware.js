/**
 * @design by milon27
 */

const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    const authHead = req.headers['authorization'];
    const token = authHead && authHead.split(" ")[1];
    if (token == null) {
        return res.sendStatus(401);
    } else {
        jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            } else {
                req.user = user;
                next();
            }
        });
    }
}

module.exports = authMiddleware;