import api from './axios';

export const registerUser = async(data: {username:string; password:string}) => {
    const res = await api.post("user/register", data);
    return res.data;
}

export const loginUser = async(data: {username:string; password:string}) => {
    const res = await api.post("user/login", data);
    return res.data;
}

export const logoutUser = async() => {
    return await api.get("user/logout");
}
