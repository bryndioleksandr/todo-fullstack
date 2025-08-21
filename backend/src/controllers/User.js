import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

export const userRegister = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExists = await User.findOne({where: { username } });
        if (userExists) return res.json({ msg: "This username is already in use" });

        const salt = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(password, salt);


        const newUser = await User.create({
            username,
            password: hashPw,
        });

        const accessToken = createAccessToken({ id: newUser.id, username: newUser.username });
        const refreshToken = createRefreshToken({ id: newUser.id, username: newUser.username });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure:false, sameSite: 'lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:false, sameSite: 'lax' });

        return res.status(201).json({
            message: "Registration successfully",
            user: { id: newUser.id, username: newUser.username },
            accessToken,
            refreshToken
        });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

export const userLogin = async (req, res) => {
    try{
        const { username, password } = req.body;

        const user = await User.findOne({where: { username } });
        if (!user) return res.status(404).json({msg: "User not found"});

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) return res.status(401).json({msg: "Password is invalid"});

        const accessToken = createAccessToken({ id: user.id, username: user.username });
        const refreshToken = createRefreshToken({ id: user.id, username: user.username });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure:false, sameSite: 'lax' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure:false, sameSite: 'lax' });

        return res.status(201).json({
            message: "Logged in successfully",
            user: { id: user.id, username: user.username },
            accessToken,
            refreshToken
        });
    }
    catch(err){
        return res.status(500).json({ msg: err.message });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Error during refresh token" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Refresh token is expired" });
                }
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            const userId = decoded.id;
            const username = decoded.username;

            const newAccessToken = jwt.sign(
                { id: userId, username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });

            return res.status(200).json({ msg: 'Token updated successful' });
        });

    } catch (error) {
        console.error('Error checking or updating token:', error);
        return res.status(500).json({ msg: 'server error during updating token' });
    }
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {sameSite: "none", secure: true});
        res.clearCookie('refreshToken', {sameSite: "none", secure: true});
        res.status(200).json({ msg: 'Logout completed' });
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}



