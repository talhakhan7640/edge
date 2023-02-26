import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegistrationController = (request, response) => {
  const saltRounds = 10;
  const username = request.body.username;
  const userEmail = request.body.email;
  const userPassword = request.body.password;

  userModel.findOne({ username: username }, function (err, document) {
    if (document) {
      if (userEmail == document.email) {
        response.status(409).json({ message: 'Username and Email already exist!' })
      } else {
        return response.send({
          message: "Username already exist",
        });
      }
    } else {
      userModel.findOne({ email: userEmail }, function (err, document) {
        if (document) {
          return response.send({
            message: "Email already exist",
          });
        } else {
          bcrypt
            .hash(userPassword, saltRounds)
            .then((hashedPassword) => {
              const user = new userModel({
                username: username,
                email: userEmail,
                password: hashedPassword,
              });
              
              user
                .save()
                .then((result) => {
                  response.status(201).send({
                    message: "User has been created successfully!",
                    result,
                  });
                })
                .catch((error) => {
                  response.status(500).send({
                    message: "Something went wrong! User could not be created!",
                    error,
                  });
                });
            })
            .catch((e) => {
              response.status(500).send({
                message:
                  "Something went wrong! Password could be hashed successfully!",
                e,
              });
            });
        }
      });
    }
  });
};

export const userLoginController = (request, response) => {
  const username = request.body.username;
  const email = request.body.email;
  const password = request.body.password;

  userModel
    .findOne({ username: username })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Wrong password",
            });
          }
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );
          response.status(200).send({
            message: "Login successful",
            email: user.email,
            token,
          });
        })
        .catch((error) => {
          response.status(400).send({
            message: "Wrong password!!",
            error,
          });
        });
    })
    .catch((error) => {
      response.status(404).send({
        message: "User not found!",
        error,
      });
    });
};