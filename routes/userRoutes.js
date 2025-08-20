import express from 'express';
import passport from 'passport';
import {
	getAllUsersController,
	createUserController,
	postUserController
} from '../controller/userController.js';
import {
    loginUserController,
    loginUserFormController,
    logoutUserController
} from '../controller/loginController.js';
import { isLoggedIn } from '../middleware/auth.js';

const router = express.Router();

router.route('/login')
    .get(loginUserFormController)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUserController);

router.get('/logout', logoutUserController);

router.get('/users', isLoggedIn, getAllUsersController);
router.get('/users/create', isLoggedIn, createUserController);
router.post('/users', isLoggedIn, postUserController);

export default router;