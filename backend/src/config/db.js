import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
    }
);

export const connectDB = async() => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error("couldnt connect to db:", error);
        process.exit(1);
    }
}
