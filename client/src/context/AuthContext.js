import { createContext } from 'react';

const noop = () => { };
// базовое значение для контекста
export const AuthContext = createContext({
    token: null,
    userId: null,
    login: noop,
    logout: noop,
    isAuthenticated: false
});