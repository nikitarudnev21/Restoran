import { useState, useCallback, useEffect } from "react"

const storageName = 'userData';

export const useAuth = () => {
    // если в localstorage есть jwt token то не нужно входить в систему
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(id);
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken
        }));

    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName); // себе на заметку: вместо localStorage можно использовать cookie = document.cookie
    }, []);

    // если по умолчанию в localstorage что-то есть то задаем локальным state`ам значения
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if (data && data.token) {
            login(data.token, data.userId);
        }
        setReady(true);
    }, [login]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    return { login, logout, token, userId, ready };
}