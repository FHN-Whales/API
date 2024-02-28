const authController = require('../controllers/authController');
const express = require('express');

const AuthRouter = express.Router();

AuthRouter.post('/Signup', authController.signUp);
AuthRouter.post('/verifyCode', authController.verifyCode);
AuthRouter.post('/newUserData', authController.createNewUser);
AuthRouter.post('/SignInFamily', authController.SignInFamily);
AuthRouter.post('/SignInRoleUser', authController.SignInRoleUser);






module.exports = AuthRouter;
