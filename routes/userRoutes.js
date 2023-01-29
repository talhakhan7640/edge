import express from 'express';
import {registerController, loginController} from '../controller/userController.js'

const userRouter = express.Router();

userRouter.post("/register", registerController);
userRouter.post("/login", loginController);

export default userRouter;
