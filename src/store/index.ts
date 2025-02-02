import type { InjectionKey } from 'vue';
import axiosInstance from '../utils/axiosInstance'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import type { UserInformationResponse, UserInformationPayload } from './types/userInformation'
import type { LoginResponse, LoginPayload, TokenData } from './types/login'
import type { DailySalesResponse, DailySalesPayload } from './types/dailySalesOverview'

export interface State {
    auth: LoginResponse | null;
    error: string | null;
    userInformation: UserInformationResponse | null;
    dailySalesOverview: DailySalesResponse | null;
}

export type TypedStore = Omit<Store<State>, 'getters'> & {
    getters: {
        isAuthenticated: boolean;
        auth: LoginResponse | null;
        error: string | null;
        userInformation: UserInformationResponse | null;
        dailySalesOverview: DailySalesResponse | null;
    }
}

export interface Getters {
    isAuthenticated: boolean;
    auth: TokenData | null;
    error: string | null;
    userInformation: any | null;
    dailySalesOverview: DailySalesResponse | null;
}

export const key: InjectionKey<TypedStore> = Symbol()

export const store = createStore<State>({
    state() {
        return {
            auth: JSON.parse(localStorage.getItem('auth') || 'null'),
            error: null,
            userInformation: null,
            dailySalesOverview: null
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
        },
        SET_USER_INFORMATION(state: State, userInformation: any) {
            state.userInformation = userInformation;
        },
        SET_DAILY_SALES_OVERVIEW(state: State, data: DailySalesResponse | null) {
            state.dailySalesOverview = data;
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
                    commit('SET_AUTH', { ...data, email: payload.email });
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
        async getUserInformation({ commit, state }) {
            try {
                if (!state.auth?.email) {
                    throw new Error('Email not found in auth state');
                }

                const payload: UserInformationPayload = {
                    email: state.auth.email
                };

                const response = await axiosInstance.post('/user/user-information', payload);
                if (response.data) {
                    commit('SET_USER_INFORMATION', response.data);
                    console.log(response.data)
                    return response.data;
                }
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.ApiStatusMessage || 'Failed to fetch user information');
                throw error;
            }
        },
        async getDailySalesOverview({ commit }, payload: DailySalesPayload) {
            try {
                const response = await axiosInstance.post('/data/daily-sales-overview/', payload);
                if (response.data) {
                    commit('SET_DAILY_SALES_OVERVIEW', response.data);
                    return response.data;
                }
            } catch (error: any) {
                commit('SET_ERROR', error.response?.data?.ApiStatusMessage || 'Failed to fetch daily sales overview');
                throw error;
            }
        }
    },
    getters: {
        isAuthenticated: (state: State): boolean => !!state.auth,
        auth: (state: State): LoginResponse | null => state.auth,
        error: (state: State): string | null => state.error,
        userInformation: (state: State): UserInformationResponse | null => state.userInformation,
        dailySalesOverview: (state: State): DailySalesResponse | null => state.dailySalesOverview
    }
})

export function useStore(): TypedStore {
    return baseUseStore(key)
}

