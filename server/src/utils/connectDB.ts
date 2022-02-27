import mongoose, { ConnectOptions } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export default async function connectDB(){

    const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:27017/admin`;
    console.log(url);
    return await mongoose.connect(url, {useNewUrlParser: true } as ConnectOptions);
}