import jwt from 'jsonwebtoken';

export default async (request, response, next) => {
	try{
		const token = await request.headers.authorization.split(" ")[1];

		const decodedToken = jwt.verify(token, "RANDOM-TOKEN");

		const user = decodedToken;

		request.user = user;

		next();

	} catch(error){
			response.status(401).send({
				error: new Error("Invalid request!"),
			})
	}
}
