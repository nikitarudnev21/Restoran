import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
export const Navbar = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const { request } = useHttp();
    const [key, setKey] = useState(null);
    const logoutHandler = e => {
        e.preventDefault();
        auth.logout();
        history.push('/');
    }

    const generateHeader = () => {
        switch (auth.role) {
            case "Admin":
                return (
                    <>
                        <li><NavLink to="/users" className="btn blue darken-3">Пользователи</NavLink></li>
                        <li><NavLink to="/restaraunts" className="btn blue darken-3">Рестораны</NavLink></li>
                        <li><a className='dropdown-trigger btn blue darken-3' data-target='dropdownCreate'>Создать</a></li>
                        <ul id='dropdownCreate' className='dropdown-content'>
                            <li><NavLink to="/createAPIKey">API ключ</NavLink></li>
                        </ul>
                    </>
                )
            case "Owner":
                return (
                    <>
                    <li><NavLink to="/restaraunts" className="btn blue darken-3">Рестораны</NavLink></li>
                    </>
                )
            default:
                return (
                    <>
                    </>
                )
        }
    }

    useEffect(() => {
        window.M.AutoInit();
    }, [window.M])

    useEffect(() => {
    window.M.AutoInit();        
    }, [])

    const getKey = useCallback(async () => {
        try {
            if (auth.role==="Owner") {
                const req = await request('/api/apikey/apikeyuser', 'POST', {id: auth.userId}, { Authorization: `Bearer ${auth.token}` });
                setKey(req.apikey);
            }
        } catch (e) {
            console.log(e.message);
        }
    }, [auth.token, request]);
    useEffect(() => {
        getKey();
    }, [getKey]);

    return (
        <nav>
            <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
                <span className="brand-logo"><NavLink to="/">NRestorans</NavLink></span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {generateHeader()}
                    <li><a className='dropdown-trigger btn blue darken-3' href='#' data-target='dropdownUser'>{auth.name}</a></li>
                    <ul id='dropdownUser' className='dropdown-content'>
                    <li><a type="button" style={{  pointerEvents: "none", cursor: "default"}} disabled className="gray">Роль: {auth.role}</a></li>
                    {auth.role==="Owner" && <li><a type="button" style={{  pointerEvents: "none", cursor: "default"}} disabled className="gray">API ключ: {key}</a></li>}
                        <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
                    </ul>
                </ul>
            </div>
        </nav>
    );
}