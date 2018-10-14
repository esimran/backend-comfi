const CONFIG = require("./../config.js");

module.exports = (req, res, next) => {
    const auth = req.headers['authorization']; 
    if(!auth) { return res.status(400).send("bad auth"); }
    const splitAuth = auth.split(' ');
    const token = splitAuth[1];
    const buf = Buffer.from(token, 'base64');
	const plainAuth = buf.toString();
	const creds = plainAuth.split(':');
	const username = creds[0];
    const password = creds[1];
    if (username !== CONFIG.AUTH_USERNAME || password !== CONFIG.AUTH_PASSWORD) {
        return res.status(400).send("bad auth");
    }
    next();
};
