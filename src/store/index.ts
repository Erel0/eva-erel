import { createStore } from 'vuex'
import axiosInstance from '../utils/axiosInstance'

interface UserState {
    isAuthenticated: boolean;
    user: any;
    error: string | null;
}

interface LoginPayload {
    email: string;
    password: string;
}

export const store = createStore({
    state(): UserState {
        return {
            isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated') || 'false'),
            user: JSON.parse(localStorage.getItem('user') || 'null'),
            error: null
        }
    },
    mutations: {
        SET_AUTH(state: UserState, auth: boolean) {
            state.isAuthenticated = auth;
            localStorage.setItem('isAuthenticated', JSON.stringify(auth));
        },
        SET_USER(state: UserState, user: any) {
            console.log('user set', user)
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
            if (user && user.accessToken) {
                localStorage.setItem('accessToken', user.accessToken);
            }
            console.log('user setted')
        },
        SET_ERROR(state: UserState, error: string | null) {
            state.error = error;
        }
    },
    actions: {
        async login({ commit }, payload: LoginPayload) {
            try {
                const loginData = {
                    Email: payload.email,
                    Password: payload.password,
                    GrantType: "password",
                    Scope: "amazon_data",
                    ClientId: "C0001",
                    ClientSecret: "SECRET0001",
                    RedirectUri: "test"
                };

                const response = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: payload.email, // Assuming email is used as username
                        password: payload.password,
                        expiresInMins: 1
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log(data)
                    commit('SET_AUTH', true);
                    commit('SET_USER', data);
                    commit('SET_ERROR', null);
                    return true;
                } else {
                    commit('SET_ERROR', data.message || 'Login failed');
                    return false;
                }
            } catch (error) {
                commit('SET_ERROR', 'Login failed');
                return false;
            }
        },
        logout({ commit }) {
            commit('SET_AUTH', false);
            commit('SET_USER', null);
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        async getUser({ commit }) {
            try {
                const response = await axiosInstance.get('/auth/me');

                return response.data;
            } catch (error) {
                commit('SET_AUTH', false);
                commit('SET_USER', null);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                // Redirect to login page
                window.location.href = '/login';
                throw new Error('Failed to fetch data');
            }
        },
    },
    getters: {
        isAuthenticated: (state: UserState) => state.isAuthenticated,
        user: (state: UserState) => state.user,
        error: (state: UserState) => state.error
    }
})

export default store
