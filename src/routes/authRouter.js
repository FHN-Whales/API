const authController = require('../controllers/authController');
const express = require('express');

const AuthRouter = express.Router();

AuthRouter.post('/Signup', authController.signUp);
AuthRouter.post('/verifyCode', authController.verifyCode);
AuthRouter.post('/newUserData', authController.getUserDataRegister);
AuthRouter.post('/SignInFamily', authController.SignInFamily);





module.exports = AuthRouter;
