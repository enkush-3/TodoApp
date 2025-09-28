import mongoose from "mongoose";

const connection = {isConnected: null};

export const connectToBD = async () => {
    try {
        if (connection.isConnected) {
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URL);
        connection.isConnected = db.connections[0].readyState;

    } catch (error) {
        console.log("Coudn't connect to DB: " + error);
    }
};