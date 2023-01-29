import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email address!"],
        unique: [true, "Email already exist!"]
    },
    password: {
        type: String,
        required: [true, "Please provide a string password"],
        unique: false
    }
})

const User = mongoose.model('user', userSchema)

export default User;
