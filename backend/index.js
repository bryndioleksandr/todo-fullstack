import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/router.js';
import cookieParser from "cookie-parser";
import {connectDB, sequelize} from "./src/config/db.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://my.vercel.app"
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);

const startServer = async () => {
    try {
        await connectDB();
        console.log('postgresql db connected');

        await sequelize.sync({ alter: true });
        const PORT = process.env.PORT || 5501;
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`)
        });
    } catch (error) {
        console.error('Express server startup error:', error);
    }
}

startServer();
