import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Authorization: localStorage.getItem('token')
    }
})

export default api;