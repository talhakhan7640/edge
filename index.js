import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import auth from './auth.js';

// User Routes
import userRouter from './routes/userRoutes.js';


dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// User Routes
app.use("/users", userRouter);

// Free endpoint
app.get("/free-endpoint", (request, response) => {
	response.json({message: "You are free to access me at any time."})
})

// Authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
	response.json({message: "You are authorized to access me."})
})


// Curb Cores Error by adding a header here
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});


try {
   mongoose.connect(process.env.MONGODB_URL, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}!`));
   }) 
   .catch((error) => {
    console.log(`Server could not be started!! ${error.message}`)
   })
} catch (error) {
   console.log("Server crashed before starting!!") 
}
