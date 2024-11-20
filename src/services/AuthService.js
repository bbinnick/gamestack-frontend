import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = this.token ? jwtDecode(this.token) : null;
        this.axiosInstance = axios.create({
            baseURL: 'http://localhost:8080',
            headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
        });
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
        this.user = jwtDecode(token);
        this.axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
    }

    removeToken() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        delete this.axiosInstance.defaults.headers.Authorization;
    }

    getUser() {
        return this.user;
    }

    getAxiosInstance() {
        return this.axiosInstance;
    }
}

const authService = new AuthService();
export default authService;