import type { InjectionKey } from 'vue';
import axiosInstance from '../utils/axiosInstance'

import { createStore, useStore as baseUseStore, Store } from 'vuex'


export interface State {
    auth: LoginResponse | null;
    error: string | null;
}

// Add this interface for strongly typed getters
export interface StoreGetters {
    isAuthenticated(state: State): boolean;
    auth(state: State): TokenData | null;
    error(state: State): string | null;
}

// Update the Store type definition
export type TypedStore = Omit<Store<State>, 'getters'> & {
    getters: {
        isAuthenticated: boolean;
        auth: TokenData | null;
        error: string | null;
    }
}

// Update the key injection
export const key: InjectionKey<TypedStore> = Symbol()

interface TokenData {
    AccessToken: string;
    RefreshToken: string;
    TokenType: string;
    ExpiresAt: string;
}

interface LoginResponse {
    ApiStatus: boolean;
    ApiStatusCode: number;
    ApiStatusMessage: string;
    Data: TokenData;
}

interface LoginPayload {
    email: string;
    password: string;
}

export interface Getters {
    isAuthenticated: boolean;
    auth: TokenData | null;
    error: string | null;
}

export const store = createStore<State>({
    state() {
        return {
            auth: JSON.parse(localStorage.getItem('auth') || 'null'),
            error: null
        }
    },
    mutations: {
        SET_AUTH(state: State, auth: LoginResponse | null) {
            state.auth = auth;
            localStorage.setItem('auth', JSON.stringify(auth));
            if (auth && auth.Data.AccessToken) {
                localStorage.setItem('accessToken', auth.Data.AccessToken);
            }
        },
        SET_ERROR(state: State, error: string | null) {
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
                    RedirectUri: "https://api.eva.guru"
                };

                const response = await axiosInstance.post<LoginResponse>('/oauth/token', loginData);

                if (response.status === 200) {
                    const data = response.data;
                    commit('SET_AUTH', data);
                    commit('SET_ERROR', null);
                    return true;
                } else {
                    commit('SET_ERROR', response.data?.ApiStatusMessage || 'Login failed');
                    return false;
                }
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.ApiStatusMessage || 'Login failed');
                return false;
            }
        },
        logout({ commit }) {
            commit('SET_AUTH', null);
            localStorage.removeItem('auth');
            localStorage.removeItem('accessToken');
        },
        async getUser({ commit }) {
            try {
                const response = await axiosInstance.get('/auth/me');
                return response.data;
            } catch (error) {
                commit('SET_AUTH', null);
                localStorage.removeItem('auth');
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                throw new Error('Failed to fetch data');
            }
        },
    },
    getters: {
        isAuthenticated: (state: State): boolean => !!state.auth,
        auth: (state: State): LoginResponse | null => state.auth,
        error: (state: State): string | null => state.error
    }
})


export function useStore(): TypedStore {
    return baseUseStore(key)
}

