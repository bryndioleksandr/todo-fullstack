import axios from "axios";

const api = axios.create({
    //baseURL: "http://localhost:5501",
    baseURL: "https://todo-api-x9xt.onrender.com",
    withCredentials: true,
});

export default api;
