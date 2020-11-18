import { useState, useCallback } from "react"

export const useHttp = () => {
    // проверяем грузится ли у нас что-то с сервера или нет
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null)
    // usecallback чтобы react не входил в рекурсию
    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true);
        try {
            if (body) {
                body = JSON.stringify(body);
                headers['Content-type'] = 'application/json';
            }
            const response = await fetch(url, { method, body, headers });
            const data = await response.json();
            if (!response.ok) {
                // data.message мы определяли в backende 
                throw new Error(data.message || 'Что-то пошло не так');
            }
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return { loading, request, error, clearError }
}