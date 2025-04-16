import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        const connection = mongoose.connection;
        connection.on('Connected', ()=>{
            console.log("MongoDB Connected")
        })
        connection.on('error', (err)=>{
            console.log("MongoDB connection error: ", err)
            process.exit()
        })

    } catch (error) {
        console.log("Error connecting to MongoDB:");
        console.log(error);
    }
}