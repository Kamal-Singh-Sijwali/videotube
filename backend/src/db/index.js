import mongoose from "mongoose";
import dns from "dns";
import { DB_NAME } from "../constants.js";

// Fix for Windows / ISP DNS refusing SRV queries (_mongodb._tcp)
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}

const connectDB = async () => {
    try {
        let rawUrl = process.env.MONGODB_URL || "";
        let connectionString = rawUrl;

        if (rawUrl) {
            if (rawUrl.includes("?")) {
                const [base, query] = rawUrl.split("?");
                connectionString = `${base.replace(/\/+$/, "")}/${DB_NAME}?${query}`;
            } else {
                connectionString = `${rawUrl.replace(/\/+$/, "")}/${DB_NAME}`;
            }
        }

        const connectionInstance = await mongoose.connect(connectionString);
        console.log(`Connected to MongoDB!! Host: ${connectionInstance.connection.host}`);
        return connectionInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message || error);
        throw error;
    }
};

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