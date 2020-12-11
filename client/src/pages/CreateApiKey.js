import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { useMessage } from '../hooks/message.hook';
import ApiKeyList from './ApiKeyList';
import { Loader } from '../components/Loader';
export default function CreateApiKey() {
    const message = useMessage();
    const [apikeys, setApikeys] = useState([]);
    const { loading, request } = useHttp();
    const { token, userId } = useContext(AuthContext);
    const fetchApikeys = useCallback(async () => {
        try {
            const fetched = await request('/api/apikey', 'GET', null, {
                Authorization: `Bearer ${token}`
            });
            console.log(fetched);
            setApikeys(fetched.apikeys);
        } catch (e) { }
    }, [token, request]);
    useEffect(() => {
        fetchApikeys();
    }, [fetchApikeys]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const requestKey = async () => {
        try {
            const data = await request('/api/apikey/apikey', 'POST', { id: userId }, {
                Authorization: `Bearer ${token}`
            });
            console.log(data.apikey);
            setApikeys(prev=>([...prev, data.apikey]));
            data.message && message(data.message)
        } catch (e) {   
            console.log(e.message);
         }
    }
    if (loading) {
        return <Loader />
    }
    return (
        <>
        <div className="row">
            <h5>Сгенерируйте API ключ</h5>
            <div className="col s8 offset s2" style={{ paddingTop: '2rem' }}>
                    <button className="btn blue darken-3" onClick={()=>requestKey()}>Сгенерировать</button>
            </div>
        </div>
            {!loading && <ApiKeyList apikeys={apikeys} setApikeys={setApikeys} />}
        </>
    )
}

