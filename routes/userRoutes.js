const express = require("express");
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// ROUTES
router.route('/signup').post(authController.signUp);
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// FROM HERE AUTHENTICATION IS REQUIRED ON ALL PATHS BELOW
router.use(authController.protect);
router.route('/updateMyPassword/:id').patch(authController.updatePassword);

router.route('/me').get(userController.getMe, userController.getUser);
router.route('/updateMe').patch(userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);

// FROM HERE ONLY ADMIN CAN PERFORM ACTIONS
router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;