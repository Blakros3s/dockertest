import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api';

export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await axios.post(
            `${API_URL}/auth/login/`,
            { username, password },
            { withCredentials: true }
        );
        return response.data;
    },

    register: async (userData: {
        username: string;
        email: string;
        password: string;
        password2: string;
        first_name?: string;
        last_name?: string;
    }) => {
        const response = await axios.post(
            `${API_URL}/auth/register/`,
            userData,
            { withCredentials: true }
        );
        return response.data;
    },

    logout: async () => {
        const response = await axios.post(
            `${API_URL}/auth/logout/`,
            {},
            { withCredentials: true }
        );
        return response.data;
    },

    getUser: async () => {
        const response = await axios.get(
            `${API_URL}/auth/user/`,
            { withCredentials: true }
        );
        return response.data;
    },
};
