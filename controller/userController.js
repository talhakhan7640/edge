import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export const registerController = (request, response) => {
  bcrypt.hash(request.body.password, saltRounds)
  .then((hashedPassword) => {
    const user = new User({
      email: request.body.email,
      password: hashedPassword
    })
	// save the new user
		user.save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        })
				.catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
	}); 
}


export const loginController = (request, response) => {
	const email = request.body.email;
	const password = request.body.password;
	
	User.findOne({ email: email })
		.then((user) => {
			bcrypt.compare(password, user.password)
				.then((passwordCheck) => {

					if(!passwordCheck) {
						return response.status(400).send({
							message: "Wrong password!!",
							error
						})
					}
	
					// Creating a JWT Token
					const token = jwt.sign(
						{
							userId: user._id,
							userEmail: user.email
						},
						"RANDOM-TOKEN",	
						{ expiresIn: "24h" }
					)

					response.status(200).send({
						message: "Login successful",
						email: user.email,
						token,
					});
				})
				.catch((error) => {
					response.status(400).send({
						message: "Wrong password!!",
						error
					})
				})
		})
		.catch((e) => {
			response.status(404).send({
				message: "Email not found",
				e,
			})
		})
}
