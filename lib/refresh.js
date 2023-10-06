const jwt = require('jsonwebtoken');

exports.refreshJWT = async (session_id, db, jwtSecret) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const session = await Session.findOne({ _id: db.mongodb.ObjectID(session_id) });
                if (!session) 
                    reject({ status: 403, message: 'Invalid Session' });
                // verify refresh token
                const decoded = jwt.verify(session.refresh_token, jwtSecret);
                const access_token = jwt.sign({ id: decoded.id }, jwtSecret, { expiresIn: 60 });
                resolve({
                    status: 200,
                    decoded: decoded,
                    token: access_token
                });
            } catch (error) {
                try {
                    await this.signOut(session_id);
                } catch (error) {
                    reject({ status: 500, message: error.message });
                }
                reject({
                    status: 403,
                    message: error.message === 'jwt expired' ? 'Session expired. Please sign in again.' : error.message
                });
            }
        })()
    });
}