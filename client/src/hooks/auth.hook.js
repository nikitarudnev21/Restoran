import { useState, useCallback, useEffect } from "react"

const storageName = 'userData';

export const useAuth = () => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);
    const [name, setName] = useState(null);
    const [role, setRole] = useState(null);
    const login = useCallback((jwtToken, id, _name, _role) => {
        setToken(jwtToken);
        setUserId(id);
        setName(_name);
        setRole(_role);
        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken, name: _name, role: _role
        }));

    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setName(null);
        setRole(null);
        localStorage.removeItem(storageName);
    }, []);
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));
        if (data && data.token) {
            login(data.token, data.userId, data.name, data.role);
        }
        setReady(true);
    }, [login]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    return { login, logout, token, userId, ready, name, role };
}