import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
       console.log(`Connected to mongodb!! Port: ${mongoose.connection.host}`);

    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}

export default connectDB;

// try {
//     await mongoose.connect(process.env.MONGODB_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//     });
//     console.log("MongoDB connected");
// } catch (error) {
//     console.log("Error connecting to MongoDB", error);
//     throw error;
// }