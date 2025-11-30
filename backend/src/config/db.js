import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const dialectOptions = isProduction ? {
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
} : {};

export const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions,
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: "postgres",
            dialectOptions,
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
