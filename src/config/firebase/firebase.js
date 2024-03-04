const dotenv = require('dotenv');
const firebase = require('firebase-admin')
const serviceAccount = require('./serviceAccountKeys.json')
dotenv.configDotenv()


firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});



module.exports = { firebase }


