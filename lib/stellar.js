const jwt = require('jsonwebtoken');
const {refreshJWT} = require('./refresh');

const Stellar = (db, jwtSecret) => {
	return (req, res, next) => {
		let token = req.cookies.user_jwt;
		if (!token) {
			return res.status(401).json({
				code: 401, 
				info: 'No Token Provided', 
				error: 'Please login to access the content you requested.'
			});
		}

		jwt.verify(token, jwtSecret, async (err, decoded) => {
			if (err) {
				refreshJWT(req.cookies.user_session_id, db, jwtSecret).then((response) => {
					res.cookie('user_jwt', 
						response['token'], 
						{
							maxAge: 10000000000, 
							secure: process.env.NODE_ENV === 'prod', 
							httpOnly: true, 
							sameSite: false
						}
					);
					req.decoded = response.decoded;
					next();
				}, error => {
					res.clearCookie('user_jwt');
					res.clearCookie('user_jwt_refresh', { path: '/refreshJWT' });
					res.clearCookie('user_session_id');

					return res.status(error.status).send({ code: error.status, info: 'error', error: error.message });
				});
			} else {
				req.decoded = decoded;
				next();
			}
		});
	}
}

module.exports = Stellar;