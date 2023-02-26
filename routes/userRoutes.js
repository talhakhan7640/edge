import express from 'express';
import {userRegistrationController, userLoginController} from '../controller/userController.js'

const userRouter = express.Router();

userRouter.post("/register", userRegistrationController);
userRouter.post("/login", userLoginController);

export default userRouter;
